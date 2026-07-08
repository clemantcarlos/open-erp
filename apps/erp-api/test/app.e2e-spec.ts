import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("OpenERP API (e2e)", () => {
  let app: INestApplication;
  let jwtToken: string;
  let productId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
    );
    await app.init();

    // Get a real product with sufficient stock
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();
    const product = await prisma.product.findFirst({
      where: { quantity: { gte: 10 } },
      select: { id: true },
    });
    productId = product.id;
    await prisma["$disconnect"]();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  const auth = () => ({ Authorization: `Bearer ${jwtToken}` });

  // ── Auth ──────────────────────────────────────────────
  describe("Auth", () => {
    it("POST /auth/local/signin — returns tokens", async () => {
      const res = await request(app.getHttpServer())
        .post("/auth/local/signin")
        .send({ email: "admin@openerp.local", password: "admin" })
        .expect(200);

      expect(res.body.data.tokens.access_token).toBeDefined();
      jwtToken = res.body.data.tokens.access_token;
    });

    it("GET /products — 401 without token", async () => {
      await request(app.getHttpServer()).get("/products").expect(401);
    });
  });

  // ── Products ──────────────────────────────────────────
  describe("Products", () => {
    it("GET /products — returns paginated list", async () => {
      const res = await request(app.getHttpServer())
        .get("/products")
        .set(auth())
        .expect(200);

      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta.total).toBeGreaterThan(0);
    });

    it("GET /products/stock-summary — returns summary object", async () => {
      const res = await request(app.getHttpServer())
        .get("/products/stock-summary")
        .set(auth())
        .expect(200);

      expect(res.body.totalProducts).toBeGreaterThan(0);
      expect(Array.isArray(res.body.lowStock)).toBe(true);
    });
  });

  // ── Sales ─────────────────────────────────────────────
  describe("Sales", () => {
    let saleId: string;

    it("POST /sales — creates sale", async () => {
      const res = await request(app.getHttpServer())
        .post("/sales")
        .set(auth())
        .send({
          customer: "Test Customer",
          items: [{ productId, quantity: 1, unitPrice: 10, subtotal: 10 }],
          subtotal: 10,
          tax: 1.6,
          total: 11.6,
          paymentMethod: "cash",
        })
        .expect(201);

      saleId = res.body.id;
      expect(saleId).toBeDefined();
    });

    it("GET /sales — returns paginated list", async () => {
      const res = await request(app.getHttpServer())
        .get("/sales")
        .set(auth())
        .expect(200);

      expect(res.body.meta).toBeDefined();
    });

    it("GET /sales/:id — returns sale", async () => {
      const res = await request(app.getHttpServer())
        .get(`/sales/${saleId}`)
        .set(auth())
        .expect(200);

      expect(res.body.id).toBe(saleId);
    });

    it("PATCH /sales/:id — updates sale", async () => {
      await request(app.getHttpServer())
        .patch(`/sales/${saleId}`)
        .set(auth())
        .send({ status: "refunded" })
        .expect(200);
    });

    it("DELETE /sales/:id — deletes sale", async () => {
      await request(app.getHttpServer())
        .delete(`/sales/${saleId}`)
        .set(auth())
        .expect(200);
    });
  });

  // ── Purchases ─────────────────────────────────────────
  describe("Purchases", () => {
    let purchaseId: string;

    it("POST /purchases — creates purchase", async () => {
      const res = await request(app.getHttpServer())
        .post("/purchases")
        .set(auth())
        .send({
          supplier: "Test Supplier",
          items: [{ productId, quantity: 5, unitCost: 20, subtotal: 100 }],
          subtotal: 100,
          tax: 16,
          total: 116,
          expectedDate: new Date().toISOString(),
        })
        .expect(201);

      purchaseId = res.body.id;
      expect(purchaseId).toBeDefined();
    });

    it("GET /purchases — returns paginated list", async () => {
      const res = await request(app.getHttpServer())
        .get("/purchases")
        .set(auth())
        .expect(200);

      expect(res.body.meta).toBeDefined();
    });

    it("GET /purchases/:id — returns purchase", async () => {
      const res = await request(app.getHttpServer())
        .get(`/purchases/${purchaseId}`)
        .set(auth())
        .expect(200);

      expect(res.body.id).toBe(purchaseId);
    });

    it("DELETE /purchases/:id — deletes purchase", async () => {
      await request(app.getHttpServer())
        .delete(`/purchases/${purchaseId}`)
        .set(auth())
        .expect(200);
    });
  });

  // ── Accounting ────────────────────────────────────────
  describe("Accounting", () => {
    let accountId: string;
    let journalId: string;

    it("POST /accounting/accounts — creates account", async () => {
      const res = await request(app.getHttpServer())
        .post("/accounting/accounts")
        .set(auth())
        .send({ code: "9999", name: "Test Account", type: "asset" })
        .expect(201);

      accountId = res.body.id;
      expect(accountId).toBeDefined();
    });

    it("GET /accounting/accounts — returns paginated list", async () => {
      const res = await request(app.getHttpServer())
        .get("/accounting/accounts")
        .set(auth())
        .expect(200);

      expect(res.body.data).toBeDefined();
      expect(res.body.meta).toBeDefined();
    });

    it("POST /accounting/journal — creates balanced entry", async () => {
      const res = await request(app.getHttpServer())
        .post("/accounting/journal")
        .set(auth())
        .send({
          date: new Date().toISOString(),
          description: "Test entry",
          reference: "T-001",
          lines: [
            { accountId, debit: 100, credit: 0 },
            { accountId, debit: 0, credit: 100 },
          ],
        })
        .expect(201);

      journalId = res.body.id;
      expect(journalId).toBeDefined();
    });

    it("POST /accounting/journal — rejects unbalanced entry", async () => {
      await request(app.getHttpServer())
        .post("/accounting/journal")
        .set(auth())
        .send({
          date: new Date().toISOString(),
          description: "Unbalanced",
          reference: "T-002",
          lines: [
            { accountId, debit: 100, credit: 0 },
            { accountId, debit: 0, credit: 50 },
          ],
        })
        .expect(400);
    });

    it("DELETE /accounting/journal/:id — deletes entry", async () => {
      await request(app.getHttpServer())
        .delete(`/accounting/journal/${journalId}`)
        .set(auth())
        .expect(200);
    });

    it("DELETE /accounting/accounts/:id — deletes account", async () => {
      await request(app.getHttpServer())
        .delete(`/accounting/accounts/${accountId}`)
        .set(auth())
        .expect(200);
    });
  });

  // ── Payroll ───────────────────────────────────────────
  describe("Payroll", () => {
    let employeeId: string;

    it("POST /payroll/employees — creates employee", async () => {
      const res = await request(app.getHttpServer())
        .post("/payroll/employees")
        .set(auth())
        .send({
          name: "Test Employee",
          email: `test-${Date.now()}@test.com`,
          phone: "123456",
          position: "Tester",
          department: "QA",
          salary: 1000,
          hireDate: new Date().toISOString(),
        })
        .expect(201);

      employeeId = res.body.id;
      expect(employeeId).toBeDefined();
    });

    it("GET /payroll/employees — returns paginated list", async () => {
      const res = await request(app.getHttpServer())
        .get("/payroll/employees")
        .set(auth())
        .expect(200);

      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
    });

    it("GET /payroll/employees/:id — returns employee", async () => {
      const res = await request(app.getHttpServer())
        .get(`/payroll/employees/${employeeId}`)
        .set(auth())
        .expect(200);

      expect(res.body.id).toBe(employeeId);
    });

    it("POST /payroll/attendance — creates attendance record", async () => {
      const res = await request(app.getHttpServer())
        .post("/payroll/attendance")
        .set(auth())
        .send({
          employeeId,
          employeeName: "Test Employee",
          date: new Date().toISOString(),
          clockIn: "09:00",
          status: "present",
        })
        .expect(201);

      expect(res.body.id).toBeDefined();
    });

    it("GET /payroll/attendance — returns list", async () => {
      const res = await request(app.getHttpServer())
        .get("/payroll/attendance")
        .set(auth())
        .expect(200);

      expect(res.body.meta).toBeDefined();
    });

    it("POST /payroll/leave — creates leave request", async () => {
      const now = new Date();
      const next = new Date(now.getTime() + 86400000 * 3);
      const res = await request(app.getHttpServer())
        .post("/payroll/leave")
        .set(auth())
        .send({
          employeeId,
          employeeName: "Test Employee",
          type: "personal",
          startDate: now.toISOString(),
          endDate: next.toISOString(),
          days: 4,
          reason: "Test leave",
        })
        .expect(201);

      expect(res.body.id).toBeDefined();
    });

    it("GET /payroll/leave — returns list", async () => {
      const res = await request(app.getHttpServer())
        .get("/payroll/leave")
        .set(auth())
        .expect(200);

      expect(res.body.meta).toBeDefined();
    });

    it("POST /payroll/records — creates payroll record", async () => {
      const res = await request(app.getHttpServer())
        .post("/payroll/records")
        .set(auth())
        .send({
          employeeId,
          employeeName: "Test Employee",
          period: "2026-01",
          baseSalary: 5000,
          bonuses: 500,
          deductions: 200,
          tax: 100,
          netPay: 5200,
        })
        .expect(201);

      expect(res.body.id).toBeDefined();
    });

    it("GET /payroll/records — returns list", async () => {
      const res = await request(app.getHttpServer())
        .get("/payroll/records")
        .set(auth())
        .expect(200);

      expect(res.body.meta).toBeDefined();
    });

    it("DELETE /payroll/employees/:id — deletes employee (admin)", async () => {
      // Create a separate employee for deletion (original has FK references)
      const emp = await request(app.getHttpServer())
        .post("/payroll/employees")
        .set(auth())
        .send({ name: "Deletable", email: `del-${Date.now()}@test.com`, phone: "000", position: "Temp", department: "Temp", salary: 1, hireDate: new Date().toISOString() })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/payroll/employees/${emp.body.id}`)
        .set(auth())
        .expect(200);
    });
  });

  // ── Customers ─────────────────────────────────────────
  describe("Customers", () => {
    let customerId: string;

    it("POST /customers — creates customer", async () => {
      const res = await request(app.getHttpServer())
        .post("/customers")
        .set(auth())
        .send({ name: "Test Customer", email: "test@test.com", phone: "5551234" })
        .expect(201);

      customerId = res.body.id;
      expect(customerId).toBeDefined();
    });

    it("GET /customers — returns paginated list", async () => {
      const res = await request(app.getHttpServer())
        .get("/customers")
        .set(auth())
        .expect(200);

      expect(res.body.meta).toBeDefined();
    });

    it("GET /customers/:id — returns customer", async () => {
      const res = await request(app.getHttpServer())
        .get(`/customers/${customerId}`)
        .set(auth())
        .expect(200);

      expect(res.body.id).toBe(customerId);
    });

    it("PATCH /customers/:id — updates customer", async () => {
      await request(app.getHttpServer())
        .patch(`/customers/${customerId}`)
        .set(auth())
        .send({ name: "Updated Customer" })
        .expect(200);
    });

    it("DELETE /customers/:id — deletes customer", async () => {
      await request(app.getHttpServer())
        .delete(`/customers/${customerId}`)
        .set(auth())
        .expect(200);
    });
  });

  // ── Visits ────────────────────────────────────────────
  describe("Visits", () => {
    let visitId: string;
    let custId: string;

    it("POST /visits — creates visit", async () => {
      // Create a customer first
      const cust = await request(app.getHttpServer())
        .post("/customers")
        .set(auth())
        .send({ name: "Visit Customer" })
        .expect(201);
      custId = cust.body.id;

      const res = await request(app.getHttpServer())
        .post("/visits")
        .set(auth())
        .send({
          customerId: custId,
          date: new Date().toISOString(),
          time: "10:00",
          type: "scheduled",
          purpose: "Follow up",
        })
        .expect(201);

      visitId = res.body.id;
      expect(visitId).toBeDefined();
    });

    it("GET /visits — returns paginated list", async () => {
      const res = await request(app.getHttpServer())
        .get("/visits")
        .set(auth())
        .expect(200);

      expect(res.body.meta).toBeDefined();
    });

    it("GET /visits/:id — returns visit", async () => {
      const res = await request(app.getHttpServer())
        .get(`/visits/${visitId}`)
        .set(auth())
        .expect(200);

      expect(res.body.id).toBe(visitId);
    });

    it("DELETE /visits/:id — deletes visit", async () => {
      await request(app.getHttpServer())
        .delete(`/visits/${visitId}`)
        .set(auth())
        .expect(200);
    });

    it("DELETE /customers/:id — cleans up customer", async () => {
      await request(app.getHttpServer())
        .delete(`/customers/${custId}`)
        .set(auth())
        .expect(200);
    });
  });

  // ── Manufacturing ─────────────────────────────────────
  describe("Manufacturing", () => {
    let processStepId: string;
    let compositeId: string;
    let orderId: string;

    it("POST /manufacturing/process-steps — creates step", async () => {
      const res = await request(app.getHttpServer())
        .post("/manufacturing/process-steps")
        .set(auth())
        .send({ processId: `PS-${Date.now()}`, processName: "Test Process", description: "Testing", order: 1 })
        .expect(201);

      processStepId = res.body.id;
      expect(processStepId).toBeDefined();
    });

    it("GET /manufacturing/process-steps — returns list", async () => {
      const res = await request(app.getHttpServer())
        .get("/manufacturing/process-steps")
        .set(auth())
        .expect(200);

      expect(res.body.meta).toBeDefined();
    });

    it("POST /manufacturing/composite-products — creates composite", async () => {
      const res = await request(app.getHttpServer())
        .post("/manufacturing/composite-products")
        .set(auth())
        .send({ name: "Test Composite", sku: `CMP-${Date.now()}`, category: "Comida", salePrice: 50, bom: [], routing: [] })
        .expect(201);

      compositeId = res.body.id;
      expect(compositeId).toBeDefined();
    });

    it("GET /manufacturing/composite-products — returns list", async () => {
      const res = await request(app.getHttpServer())
        .get("/manufacturing/composite-products")
        .set(auth())
        .expect(200);

      expect(res.body.meta).toBeDefined();
    });

    it("POST /manufacturing/orders — creates production order", async () => {
      const res = await request(app.getHttpServer())
        .post("/manufacturing/orders")
        .set(auth())
        .send({ compositeProductId: compositeId, compositeProductName: "Test Composite", quantityPlanned: 100, scheduledDate: new Date().toISOString() })
        .expect(201);

      orderId = res.body.id;
      expect(orderId).toBeDefined();
    });

    it("GET /manufacturing/orders — returns list", async () => {
      const res = await request(app.getHttpServer())
        .get("/manufacturing/orders")
        .set(auth())
        .expect(200);

      expect(res.body.meta).toBeDefined();
    });

    it("GET /manufacturing/orders/:id — returns order", async () => {
      const res = await request(app.getHttpServer())
        .get(`/manufacturing/orders/${orderId}`)
        .set(auth())
        .expect(200);

      expect(res.body.id).toBe(orderId);
    });

    it("DELETE /manufacturing/orders/:id — deletes order", async () => {
      await request(app.getHttpServer())
        .delete(`/manufacturing/orders/${orderId}`)
        .set(auth())
        .expect(200);
    });

    it("DELETE /manufacturing/composite-products/:id — deletes composite", async () => {
      await request(app.getHttpServer())
        .delete(`/manufacturing/composite-products/${compositeId}`)
        .set(auth())
        .expect(200);
    });

    it("DELETE /manufacturing/process-steps/:id — deletes step", async () => {
      await request(app.getHttpServer())
        .delete(`/manufacturing/process-steps/${processStepId}`)
        .set(auth())
        .expect(200);
    });
  });

  // ── Auth Extended ─────────────────────────────────────
  describe("Auth Extended", () => {
    it("POST /auth/local/signup — creates new user", async () => {
      const res = await request(app.getHttpServer())
        .post("/auth/local/signup")
        .send({ name: "New User", email: `new-${Date.now()}@test.com`, password: "Passw0rd!@" })
        .expect(201);

      expect(res.body.data).toBeDefined();
    });

    it("POST /auth/local/signin — rejects wrong password", async () => {
      await request(app.getHttpServer())
        .post("/auth/local/signin")
        .send({ email: "admin@openerp.local", password: "wrongpassword" })
        .expect(401);
    });
  });

  // ── Validation ────────────────────────────────────────
  describe("Validation", () => {
    it("POST /sales — rejects invalid body", async () => {
      await request(app.getHttpServer())
        .post("/sales")
        .set(auth())
        .send({ invalid: true })
        .expect(400);
    });

    it("GET /nonexistent — 404", async () => {
      await request(app.getHttpServer())
        .get("/nonexistent")
        .set(auth())
        .expect(404);
    });
  });
});
