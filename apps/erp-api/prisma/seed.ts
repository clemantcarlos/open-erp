import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const email = "admin@openerp.local";
  const exists = await prisma.user.findUnique({ where: { email } });
  if (!exists) {
    const hash = await bcrypt.hash("admin", 10);
    await prisma.user.create({
      data: { name: "Admin", email, password: hash, role: "admin" },
    });
    console.log("Seeded admin user");
  }

  // Seed demo user (portfolio — writes are intercepted, nothing persists)
  const demoEmail = "demo@openerp.local";
  const demoExists = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!demoExists) {
    const demoHash = await bcrypt.hash("demo", 10);
    await prisma.user.create({
      data: { name: "Demo User", email: demoEmail, password: demoHash, role: "demo" },
    });
    console.log("Seeded demo user");
  }

  // Seed products (POS + Inventory)
  const products = [
    { sku: "BEB-001", name: "Café Americano (500g)", category: "Bebidas", price: 12.5, quantity: 120, unit: "kg", minStock: 20 },
    { sku: "BEB-002", name: "Cappuccino Mix (1kg)", category: "Bebidas", price: 18.0, quantity: 8, unit: "kg", minStock: 15 },
    { sku: "BEB-003", name: "Jugo de Naranja (1L)", category: "Bebidas", price: 3.0, quantity: 45, unit: "unid", minStock: 30 },
    { sku: "BEB-004", name: "Agua Mineral (500ml)", category: "Bebidas", price: 1.5, quantity: 200, unit: "unid", minStock: 50 },
    { sku: "COM-001", name: "Pan Integral (unidad)", category: "Comida", price: 2.5, quantity: 0, unit: "unid", minStock: 25 },
    { sku: "COM-002", name: "Mantequilla (250g)", category: "Comida", price: 4.0, quantity: 35, unit: "unid", minStock: 20 },
    { sku: "COM-003", name: "Jamón Sliced (200g)", category: "Comida", price: 5.5, quantity: 12, unit: "unid", minStock: 15 },
    { sku: "COM-004", name: "Queso Mozzarella (500g)", category: "Comida", price: 7.0, quantity: 5, unit: "unid", minStock: 10 },
    { sku: "POS-001", name: "Harina de Trigo (1kg)", category: "Postres", price: 2.0, quantity: 60, unit: "kg", minStock: 30 },
    { sku: "POS-002", name: "Azúcar Refinada (1kg)", category: "Postres", price: 1.8, quantity: 85, unit: "kg", minStock: 40 },
    { sku: "POS-003", name: "Chocolate en Polvo (500g)", category: "Postres", price: 8.0, quantity: 3, unit: "kg", minStock: 10 },
    { sku: "LIM-001", name: "Detergente Multiusos", category: "Limpieza", price: 3.5, quantity: 50, unit: "unid", minStock: 20 },
    { sku: "LIM-002", name: "Jabón de Manos (500ml)", category: "Limpieza", price: 4.5, quantity: 0, unit: "unid", minStock: 15 },
    { sku: "EMP-001", name: "Vasos Descartables (50un)", category: "Empaques", price: 6.0, quantity: 180, unit: "paq", minStock: 30 },
    { sku: "EMP-002", name: "Bolsas Papel (100un)", category: "Empaques", price: 8.5, quantity: 40, unit: "paq", minStock: 20 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }
  console.log(`Seeded ${products.length} products`);

  // Seed customers
  const customersData = [
    { id: "C-001", name: "María García", email: "maria.garcia@email.com", phone: "+58 412-555-0101", segment: "vip", address: "Av. Principal, Caracas", birthDate: new Date("1985-03-15"), notes: "Prefiere mesa junto a la ventana. Alérgica a frutos secos." },
    { id: "C-002", name: "Carlos López", email: "carlos.lopez@email.com", phone: "+58 414-555-0202", segment: "regular", address: "Calle 5, Maracaibo", birthDate: new Date("1990-07-22"), notes: "Viene los martes con su familia. Pide siempre el mismo plato." },
    { id: "C-003", name: "Ana Martínez", email: "ana.martinez@email.com", phone: "+58 416-555-0303", segment: "regular", address: "Urb. Las Mercedes, Caracas", birthDate: new Date("1988-11-08"), notes: "Le gusta probar cosas nuevas. Siempre pregunta por el menú del día." },
    { id: "C-004", name: "Pedro Sánchez", email: "pedro.sanchez@email.com", phone: "+58 424-555-0404", segment: "new", address: "Av. Libertador, Valencia", birthDate: new Date("1995-01-30"), notes: "Primer cliente nuevo esta semana. Vino por recomendación." },
    { id: "C-005", name: "Laura Rodríguez", email: "laura.rodriguez@email.com", phone: "+58 412-555-0505", segment: "vip", address: "Torre Empresarial, Caracas", birthDate: new Date("1982-06-18"), notes: "Clienta fiel desde el primer día. Organiza eventos corporativos." },
    { id: "C-006", name: "Jorge Hernández", email: "jorge.hernandez@email.com", phone: "+58 414-555-0606", segment: "regular", address: "Av. Bolívar, Barquisimeto", birthDate: new Date("1992-09-05"), notes: "Prefiere pedir para llevar. Llama siempre antes de venir." },
    { id: "C-007", name: "Carmen Díaz", email: "carmen.diaz@email.com", phone: "+58 416-555-0707", segment: "regular", address: "Centro, Caracas", birthDate: new Date("1987-12-01"), notes: "Le encanta el café. Siempre pide doble espresso." },
    { id: "C-008", name: "Roberto Torres", email: "roberto.torres@email.com", phone: "+58 424-555-0808", segment: "inactive", address: "Av. Urdaneta, Caracas", birthDate: new Date("1980-04-25"), notes: "No ha venido en 3 meses. Enviar promoción de regreso." },
    { id: "C-009", name: "Isabel Flores", email: "isabel.flores@email.com", phone: "+58 412-555-0909", segment: "new", address: "Las Palmas, Caracas", birthDate: new Date("1998-08-12"), notes: "Vinó con Laura Rodríguez. Le gustó mucho el ambiente." },
    { id: "C-010", name: "Miguel Ángel Reyes", email: "miguel.reyes@email.com", phone: "+58 414-555-1010", segment: "regular", address: "Torre Florencia, Caracas", birthDate: new Date("1979-02-28"), notes: "Empresario. Viene a reuniones de trabajo. Pide reservación." },
    { id: "C-011", name: "Valentina Castro", email: "valentina.castro@email.com", phone: "+58 416-555-1111", segment: "vip", address: "Av. Francisco de Miranda, Caracas", birthDate: new Date("1993-10-17"), notes: "Influencer local. Siempre publica fotos de la comida." },
    { id: "C-012", name: "Diego Morales", email: "diego.morales@email.com", phone: "+58 424-555-1212", segment: "inactive", address: "Mérida (antes Caracas)", birthDate: new Date("1991-05-09"), notes: "Se mudó de la ciudad. Verificar si regresa." },
  ];

  for (const customer of customersData) {
    await prisma.customer.upsert({
      where: { id: customer.id },
      update: {},
      create: customer,
    });
  }
  console.log(`Seeded ${customersData.length} customers`);

  // Seed sales
  const salesData = [
    { date: new Date("2026-06-23"), customer: "María García", items: [{ name: "Café Americano", quantity: 2, price: 4.5 }, { name: "Croissant", quantity: 1, price: 3.5 }], subtotal: 12.5, tax: 2.0, total: 14.5, status: "paid", paymentMethod: "cash" },
    { date: new Date("2026-06-23"), customer: "Carlos López", items: [{ name: "Sandwich Club", quantity: 1, price: 8.0 }], subtotal: 8.0, tax: 1.28, total: 9.28, status: "paid", paymentMethod: "card" },
    { date: new Date("2026-06-23"), customer: "Ana Martínez", items: [{ name: "Ensalada César", quantity: 1, price: 6.5 }, { name: "Jugo Natural", quantity: 2, price: 3.0 }], subtotal: 12.5, tax: 2.0, total: 14.5, status: "pending", paymentMethod: "movil" },
    { date: new Date("2026-06-22"), customer: "Pedro Sánchez", items: [{ name: "Panini", quantity: 2, price: 7.0 }], subtotal: 14.0, tax: 2.24, total: 16.24, status: "paid", paymentMethod: "cash" },
    { date: new Date("2026-06-22"), customer: "Laura Rodríguez", items: [{ name: "Tiramisú", quantity: 2, price: 5.0 }, { name: "Cappuccino", quantity: 2, price: 5.5 }], subtotal: 21.0, tax: 3.36, total: 24.36, status: "cancelled", paymentMethod: "card" },
    { date: new Date("2026-06-22"), customer: "Jorge Hernández", items: [{ name: "Cappuccino", quantity: 1, price: 5.5 }], subtotal: 5.5, tax: 0.88, total: 6.38, status: "paid", paymentMethod: "cash" },
    { date: new Date("2026-06-21"), customer: "Carmen Díaz", items: [{ name: "Café Americano", quantity: 6, price: 4.5 }], subtotal: 27.0, tax: 4.32, total: 31.32, status: "paid", paymentMethod: "movil" },
    { date: new Date("2026-06-21"), customer: "Roberto Torres", items: [{ name: "Muffin", quantity: 2, price: 2.5 }], subtotal: 5.0, tax: 0.8, total: 5.8, status: "pending", paymentMethod: "card" },
    { date: new Date("2026-06-20"), customer: "Isabel Flores", items: [{ name: "Brownie", quantity: 3, price: 3.0 }], subtotal: 9.0, tax: 1.44, total: 10.44, status: "paid", paymentMethod: "cash" },
    { date: new Date("2026-06-20"), customer: "Miguel Ángel Reyes", items: [{ name: "Panini", quantity: 1, price: 7.0 }], subtotal: 7.0, tax: 1.12, total: 8.12, status: "paid", paymentMethod: "card" },
  ];

  for (const sale of salesData) {
    await prisma.sale.create({ data: sale });
  }
  console.log(`Seeded ${salesData.length} sales`);

  // Seed purchases
  const purchasesData = [
    { date: new Date("2026-06-23"), supplier: "Café Venezolano C.A.", items: [{ name: "Café Americano (500g)", quantity: 10, unitCost: 10.0 }, { name: "Cappuccino Mix (1kg)", quantity: 5, unitCost: 15.0 }], subtotal: 175.0, tax: 28.0, total: 203.0, status: "received", expectedDate: new Date("2026-06-23") },
    { date: new Date("2026-06-22"), supplier: "Distribuidora Central", items: [{ name: "Pan Integral (unidad)", quantity: 20, unitCost: 2.0 }, { name: "Mantequilla (250g)", quantity: 10, unitCost: 3.5 }], subtotal: 75.0, tax: 12.0, total: 87.0, status: "pending", expectedDate: new Date("2026-06-25") },
    { date: new Date("2026-06-22"), supplier: "Lácteos del Valle", items: [{ name: "Queso Mozzarella (500g)", quantity: 8, unitCost: 6.0 }], subtotal: 48.0, tax: 7.68, total: 55.68, status: "received", expectedDate: new Date("2026-06-22") },
    { date: new Date("2026-06-21"), supplier: "Panadería Industrial", items: [{ name: "Harina de Trigo (1kg)", quantity: 15, unitCost: 1.5 }, { name: "Azúcar Refinada (1kg)", quantity: 10, unitCost: 1.5 }], subtotal: 37.5, tax: 6.0, total: 43.5, status: "cancelled", expectedDate: new Date("2026-06-24") },
    { date: new Date("2026-06-20"), supplier: "Embotelladora Nacional", items: [{ name: "Agua Mineral (500ml)", quantity: 100, unitCost: 1.0 }, { name: "Jugo de Naranja (1L)", quantity: 20, unitCost: 2.5 }], subtotal: 150.0, tax: 24.0, total: 174.0, status: "received", expectedDate: new Date("2026-06-20") },
    { date: new Date("2026-06-20"), supplier: "Café Venezolano C.A.", items: [{ name: "Chocolate en Polvo (500g)", quantity: 5, unitCost: 7.0 }], subtotal: 35.0, tax: 5.6, total: 40.6, status: "pending", expectedDate: new Date("2026-06-27") },
    { date: new Date("2026-06-19"), supplier: "Proveedora Total", items: [{ name: "Detergente Multiusos", quantity: 20, unitCost: 3.0 }, { name: "Jabón de Manos (500ml)", quantity: 10, unitCost: 4.0 }], subtotal: 100.0, tax: 16.0, total: 116.0, status: "received", expectedDate: new Date("2026-06-19") },
    { date: new Date("2026-06-18"), supplier: "Distribuidora Central", items: [{ name: "Vasos Descartables (50un)", quantity: 5, unitCost: 5.0 }, { name: "Bolsas Papel (100un)", quantity: 3, unitCost: 7.0 }], subtotal: 46.0, tax: 7.36, total: 53.36, status: "received", expectedDate: new Date("2026-06-18") },
  ];

  for (const purchase of purchasesData) {
    await prisma.purchase.create({ data: purchase });
  }
  console.log(`Seeded ${purchasesData.length} purchases`);

  // Seed visits
  const visitsData = [
    { customerId: "C-001", date: new Date("2026-06-23"), time: "10:00", type: "scheduled", effectiveness: "effective", purpose: "Seguimiento semanal", notes: "Satisfecha con el servicio", duration: 30, nextVisit: new Date("2026-06-30") },
    { customerId: "C-005", date: new Date("2026-06-23"), time: "14:00", type: "scheduled", effectiveness: "effective", purpose: "Revisión de evento corporativo", notes: "Confirmar menú para evento del viernes", duration: 45, nextVisit: new Date("2026-06-27") },
    { customerId: "C-004", date: new Date("2026-06-22"), time: "11:30", type: "unscheduled", effectiveness: "effective", purpose: "Primera visita", notes: "Recomendado por Laura Rodríguez", duration: 20 },
    { customerId: "C-011", date: new Date("2026-06-22"), time: "16:00", type: "follow_up", effectiveness: "effective", purpose: "Seguimiento post-publicación", notes: "Pidió fotos para Instagram", duration: 25 },
    { customerId: "C-002", date: new Date("2026-06-21"), time: "19:00", type: "scheduled", effectiveness: "partially_effective", purpose: "Cena familiar", notes: "Llegaron tarde, mesa no estaba lista", duration: 60, nextVisit: new Date("2026-06-28") },
    { customerId: "C-003", date: new Date("2026-06-20"), time: "12:00", type: "scheduled", effectiveness: "effective", purpose: "Almuerzo", notes: "Probó el menú del día", duration: 40 },
    { customerId: "C-007", date: new Date("2026-06-19"), time: "08:30", type: "scheduled", effectiveness: "effective", purpose: "Café matutino", notes: "Rutina diaria, doble espresso", duration: 15 },
    { customerId: "C-006", date: new Date("2026-06-18"), time: "13:00", type: "proposal", effectiveness: "pending", purpose: "Propuesta para catering", notes: "Evento de empresa, 50 personas", duration: 30, nextVisit: new Date("2026-06-25") },
    { customerId: "C-009", date: new Date("2026-06-17"), time: "15:00", type: "support", effectiveness: "ineffective", purpose: "Queja por servicio", notes: "Pedido incorrecto, ofrecimos compensación", duration: 20 },
    { customerId: "C-010", date: new Date("2026-06-16"), time: "10:30", type: "scheduled", effectiveness: "effective", purpose: "Reunión de trabajo", notes: "Reservó mesa para 8 personas", duration: 90 },
  ];

  for (const visit of visitsData) {
    await prisma.visit.create({ data: visit });
  }
  console.log(`Seeded ${visitsData.length} visits`);

  // Seed Manufacturing - Process Steps
  const processStepsData = [
    { processId: "P1", processName: "Preparación", description: "Preparar y medir ingredientes", order: 1 },
    { processId: "P2", processName: "Corte", description: "Cortar materiales a medida", order: 2 },
    { processId: "P3", processName: "Ensamblaje", description: "Unir componentes", order: 3 },
    { processId: "P4", processName: "Cocción", description: "Cocinar o procesar térmicamente", order: 4 },
    { processId: "P5", processName: "Soldadura", description: "Unir piezas por soldadura", order: 5 },
    { processId: "P6", processName: "Pintura", description: "Aplicar acabado superficial", order: 6 },
    { processId: "P7", processName: "Empaque", description: "Empaquetar producto final", order: 7 },
    { processId: "P8", processName: "Control de Calidad", description: "Inspección y verificación", order: 8 },
  ];

  for (const step of processStepsData) {
    await prisma.processStep.upsert({
      where: { processId: step.processId },
      update: {},
      create: step,
    });
  }
  console.log(`Seeded ${processStepsData.length} process steps`);

  // Seed Manufacturing - Composite Products
  const compositeProductsData = [
    {
      name: "Sandwich Club",
      sku: "REST-001",
      category: "Restaurante",
      unit: "unid",
      salePrice: 8.0,
      emoji: "🥪",
      bom: [
        { ingredientId: "5", ingredientName: "Pan Integral", quantity: 1, unit: "unid", unitCost: 2.5 },
        { ingredientId: "7", ingredientName: "Jamón Sliced", quantity: 2, unit: "unid", unitCost: 1.2 },
        { ingredientId: "8", ingredientName: "Queso Mozzarella", quantity: 1, unit: "unid", unitCost: 1.8 },
        { ingredientId: "I-001", ingredientName: "Lechuga", quantity: 1, unit: "hoja", unitCost: 0.3 },
      ],
      routing: [
        { processStepId: "P1", processName: "Preparación", costPerUnit: 0.5, timeMinutes: 2 },
        { processStepId: "P3", processName: "Ensamblaje", costPerUnit: 0.3, timeMinutes: 3 },
        { processStepId: "P7", processName: "Empaque", costPerUnit: 0.2, timeMinutes: 1 },
      ],
    },
    {
      name: "Cappuccino",
      sku: "REST-002",
      category: "Restaurante",
      unit: "unid",
      salePrice: 5.5,
      emoji: "☕",
      bom: [
        { ingredientId: "1", ingredientName: "Café Americano (500g)", quantity: 0.02, unit: "kg", unitCost: 0.5 },
        { ingredientId: "I-002", ingredientName: "Leche Entera", quantity: 0.2, unit: "L", unitCost: 0.3 },
        { ingredientId: "I-003", ingredientName: "Espumante", quantity: 0.03, unit: "L", unitCost: 0.15 },
      ],
      routing: [
        { processStepId: "P1", processName: "Preparación", costPerUnit: 0.2, timeMinutes: 1 },
        { processStepId: "P4", processName: "Cocción", costPerUnit: 0.4, timeMinutes: 3 },
      ],
    },
    {
      name: "Tiramisú",
      sku: "REST-003",
      category: "Restaurante",
      unit: "unid",
      salePrice: 5.0,
      emoji: "🍰",
      bom: [
        { ingredientId: "I-004", ingredientName: "Queso Mascarpone", quantity: 0.08, unit: "kg", unitCost: 1.5 },
        { ingredientId: "9", ingredientName: "Harina de Trigo (1kg)", quantity: 0.03, unit: "kg", unitCost: 0.06 },
        { ingredientId: "I-005", ingredientName: "Café Espresso", quantity: 0.05, unit: "L", unitCost: 0.2 },
        { ingredientId: "10", ingredientName: "Azúcar Refinada (1kg)", quantity: 0.02, unit: "kg", unitCost: 0.04 },
        { ingredientId: "I-006", ingredientName: "Cacao en Polvo", quantity: 0.01, unit: "kg", unitCost: 0.3 },
      ],
      routing: [
        { processStepId: "P1", processName: "Preparación", costPerUnit: 0.8, timeMinutes: 10 },
        { processStepId: "P3", processName: "Ensamblaje", costPerUnit: 0.5, timeMinutes: 8 },
        { processStepId: "P4", processName: "Cocción", costPerUnit: 0.3, timeMinutes: 0 },
      ],
    },
    {
      name: "Widget A - Acero",
      sku: "IND-001",
      category: "Industrial",
      unit: "unid",
      salePrice: 25.0,
      emoji: "⚙️",
      bom: [
        { ingredientId: "I-101", ingredientName: "Placa Acero 304 (1m²)", quantity: 0.5, unit: "m²", unitCost: 8.0 },
        { ingredientId: "I-102", ingredientName: "Tornillo M8×20", quantity: 4, unit: "unid", unitCost: 0.15 },
        { ingredientId: "I-103", ingredientName: "Pintura Epóxica (1L)", quantity: 0.1, unit: "L", unitCost: 2.5 },
      ],
      routing: [
        { processStepId: "P2", processName: "Corte", costPerUnit: 1.5, timeMinutes: 5 },
        { processStepId: "P5", processName: "Soldadura", costPerUnit: 3.0, timeMinutes: 8 },
        { processStepId: "P6", processName: "Pintura", costPerUnit: 1.2, timeMinutes: 4 },
        { processStepId: "P8", processName: "Control de Calidad", costPerUnit: 0.8, timeMinutes: 3 },
      ],
    },
    {
      name: "Panel Solar 100W",
      sku: "IND-002",
      category: "Industrial",
      unit: "unid",
      salePrice: 120.0,
      emoji: "☀️",
      bom: [
        { ingredientId: "I-104", ingredientName: "Celda Solar Monocristalina", quantity: 36, unit: "unid", unitCost: 1.5 },
        { ingredientId: "I-105", ingredientName: "Marco Aluminio Anodizado", quantity: 1, unit: "unid", unitCost: 8.0 },
        { ingredientId: "I-106", ingredientName: "Cable Fotovoltaico (2m)", quantity: 1, unit: "unid", unitCost: 3.0 },
        { ingredientId: "I-107", ingredientName: "Vidrio Templado 3.2mm", quantity: 1, unit: "unid", unitCost: 12.0 },
      ],
      routing: [
        { processStepId: "P3", processName: "Ensamblaje", costPerUnit: 5.0, timeMinutes: 20 },
        { processStepId: "P5", processName: "Soldadura", costPerUnit: 4.0, timeMinutes: 15 },
        { processStepId: "P8", processName: "Control de Calidad", costPerUnit: 2.0, timeMinutes: 10 },
      ],
    },
    {
      name: "Motor Eléctrico 1HP",
      sku: "IND-003",
      category: "Industrial",
      unit: "unid",
      salePrice: 85.0,
      emoji: "🔧",
      bom: [
        { ingredientId: "I-108", ingredientName: "Bobinado Cobre (2kg)", quantity: 2, unit: "kg", unitCost: 15.0 },
        { ingredientId: "I-109", ingredientName: "Rodamiento 6205", quantity: 2, unit: "unid", unitCost: 4.5 },
        { ingredientId: "I-110", ingredientName: "Eje de Acero", quantity: 1, unit: "unid", unitCost: 6.0 },
        { ingredientId: "I-111", ingredientName: "Carcaza Hierro", quantity: 1, unit: "unid", unitCost: 8.0 },
      ],
      routing: [
        { processStepId: "P2", processName: "Corte", costPerUnit: 2.0, timeMinutes: 6 },
        { processStepId: "P5", processName: "Soldadura", costPerUnit: 4.0, timeMinutes: 12 },
        { processStepId: "P3", processName: "Ensamblaje", costPerUnit: 6.0, timeMinutes: 25 },
        { processStepId: "P6", processName: "Pintura", costPerUnit: 1.5, timeMinutes: 5 },
        { processStepId: "P8", processName: "Control de Calidad", costPerUnit: 3.0, timeMinutes: 15 },
      ],
    },
  ];

  for (const product of compositeProductsData) {
    await prisma.compositeProduct.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }
  console.log(`Seeded ${compositeProductsData.length} composite products`);

  // Seed Manufacturing - Production Orders
  const productionOrdersData = [
    { compositeProductSku: "REST-001", compositeProductName: "Sandwich Club", quantityPlanned: 50, quantityProduced: 50, status: "completed", scheduledDate: new Date("2026-06-22"), completedDate: new Date("2026-06-22"), notes: "Pedido especial evento" },
    { compositeProductSku: "REST-002", compositeProductName: "Cappuccino", quantityPlanned: 100, quantityProduced: 72, status: "in_progress", scheduledDate: new Date("2026-06-23"), completedDate: null, notes: "" },
    { compositeProductSku: "IND-001", compositeProductName: "Widget A - Acero", quantityPlanned: 200, quantityProduced: 0, status: "planned", scheduledDate: new Date("2026-06-25"), completedDate: null, notes: "Orden mensual" },
    { compositeProductSku: "IND-002", compositeProductName: "Panel Solar 100W", quantityPlanned: 50, quantityProduced: 50, status: "completed", scheduledDate: new Date("2026-06-20"), completedDate: new Date("2026-06-21"), notes: "Proyecto techo solar" },
    { compositeProductSku: "IND-003", compositeProductName: "Motor Eléctrico 1HP", quantityPlanned: 30, quantityProduced: 12, status: "in_progress", scheduledDate: new Date("2026-06-23"), completedDate: null, notes: "Reposición stock mínimo" },
    { compositeProductSku: "REST-003", compositeProductName: "Tiramisú", quantityPlanned: 25, quantityProduced: 0, status: "cancelled", scheduledDate: new Date("2026-06-21"), completedDate: null, notes: "Cancelado por falta de mascarpone" },
  ];

  for (const order of productionOrdersData) {
    const cp = await prisma.compositeProduct.findUnique({ where: { sku: order.compositeProductSku } });
    if (cp) {
      await prisma.productionOrder.create({
        data: {
          compositeProductId: cp.id,
          compositeProductName: order.compositeProductName,
          quantityPlanned: order.quantityPlanned,
          quantityProduced: order.quantityProduced,
          status: order.status,
          scheduledDate: order.scheduledDate,
          completedDate: order.completedDate,
          notes: order.notes,
        },
      });
    }
  }
  console.log(`Seeded ${productionOrdersData.length} production orders`);

  // Seed Accounting - Accounts
  const accountsData = [
    { code: "1101", name: "Efectivo", type: "asset", balance: 3200.0 },
    { code: "1102", name: "Banco Nacional", type: "asset", balance: 18500.0 },
    { code: "1103", name: "Cuentas por Cobrar", type: "asset", balance: 4350.0 },
    { code: "1201", name: "Inventario", type: "asset", balance: 12180.0 },
    { code: "1301", name: "Equipo de Oficina", type: "asset", balance: 7000.0 },
    { code: "2101", name: "Cuentas por Pagar", type: "liability", balance: 6800.0 },
    { code: "2102", name: "IVA por Pagar", type: "liability", balance: 2450.0 },
    { code: "2103", name: "Retenciones por Pagar", type: "liability", balance: 1200.0 },
    { code: "2201", name: "Préstamo Bancario", type: "liability", balance: 2350.0 },
    { code: "3101", name: "Capital Social", type: "equity", balance: 25000.0 },
    { code: "3201", name: "Resultados Acumulados", type: "equity", balance: 7430.0 },
    { code: "4101", name: "Ingresos por Ventas", type: "revenue", balance: 18500.0 },
    { code: "4102", name: "Ingresos por Servicios", type: "revenue", balance: 3200.0 },
    { code: "5101", name: "Costo de Mercancía", type: "expense", balance: 8400.0 },
    { code: "5201", name: "Sueldos y Salarios", type: "expense", balance: 6500.0 },
    { code: "5202", name: "Arrendamiento", type: "expense", balance: 2400.0 },
    { code: "5203", name: "Servicios Públicos", type: "expense", balance: 890.0 },
    { code: "5204", name: "Útiles y Suministros", type: "expense", balance: 340.0 },
    { code: "5205", name: "Mantenimiento", type: "expense", balance: 250.0 },
  ];

  for (const account of accountsData) {
    await prisma.account.upsert({
      where: { code: account.code },
      update: {},
      create: account,
    });
  }
  console.log(`Seeded ${accountsData.length} accounts`);

  // Seed Accounting - Journal Entries
  const journalEntriesData = [
    {
      date: new Date("2026-06-23"),
      description: "Venta POS - María García",
      reference: "V-001",
      status: "posted",
      lines: [
        { accountId: "1101", accountName: "Efectivo", debit: 29.0, credit: 0 },
        { accountId: "4101", accountName: "Ingresos por Ventas", debit: 0, credit: 25.0 },
        { accountId: "2102", accountName: "IVA por Pagar", debit: 0, credit: 4.0 },
      ],
    },
    {
      date: new Date("2026-06-23"),
      description: "Venta POS - Carlos López",
      reference: "V-002",
      status: "posted",
      lines: [
        { accountId: "1102", accountName: "Banco Nacional", debit: 9.86, credit: 0 },
        { accountId: "4101", accountName: "Ingresos por Ventas", debit: 0, credit: 8.5 },
        { accountId: "2102", accountName: "IVA por Pagar", debit: 0, credit: 1.36 },
      ],
    },
    {
      date: new Date("2026-06-23"),
      description: "Compra insumos - Café Venezolano C.A.",
      reference: "C-001",
      status: "posted",
      lines: [
        { accountId: "5101", accountName: "Costo de Mercancía", debit: 150.0, credit: 0 },
        { accountId: "2102", accountName: "IVA por Pagar", debit: 24.0, credit: 0 },
        { accountId: "2101", accountName: "Cuentas por Pagar", debit: 0, credit: 174.0 },
      ],
    },
    {
      date: new Date("2026-06-22"),
      description: "Pago arrendamiento junio",
      reference: "G-001",
      status: "posted",
      lines: [
        { accountId: "5202", accountName: "Arrendamiento", debit: 2400.0, credit: 0 },
        { accountId: "1102", accountName: "Banco Nacional", debit: 0, credit: 2400.0 },
      ],
    },
    {
      date: new Date("2026-06-22"),
      description: "Pago nómina quincenal",
      reference: "N-001",
      status: "posted",
      lines: [
        { accountId: "5201", accountName: "Sueldos y Salarios", debit: 3250.0, credit: 0 },
        { accountId: "2103", accountName: "Retenciones por Pagar", debit: 0, credit: 325.0 },
        { accountId: "1102", accountName: "Banco Nacional", debit: 0, credit: 2925.0 },
      ],
    },
    {
      date: new Date("2026-06-21"),
      description: "Venta POS - Carmen Díaz",
      reference: "V-007",
      status: "posted",
      lines: [
        { accountId: "1101", accountName: "Efectivo", debit: 67.28, credit: 0 },
        { accountId: "4101", accountName: "Ingresos por Ventas", debit: 0, credit: 58.0 },
        { accountId: "2102", accountName: "IVA por Pagar", debit: 0, credit: 9.28 },
      ],
    },
    {
      date: new Date("2026-06-21"),
      description: "Compra Panel Solar - Proveedor Solar",
      reference: "C-004",
      status: "draft",
      lines: [
        { accountId: "1201", accountName: "Inventario", debit: 450.0, credit: 0 },
        { accountId: "2102", accountName: "IVA por Pagar", debit: 72.0, credit: 0 },
        { accountId: "2101", accountName: "Cuentas por Pagar", debit: 0, credit: 522.0 },
      ],
    },
    {
      date: new Date("2026-06-20"),
      description: "Pago servicios públicos mayo",
      reference: "G-002",
      status: "posted",
      lines: [
        { accountId: "5203", accountName: "Servicios Públicos", debit: 890.0, credit: 0 },
        { accountId: "1101", accountName: "Efectivo", debit: 0, credit: 890.0 },
      ],
    },
    {
      date: new Date("2026-06-20"),
      description: "Ingreso por servicio de consultoría",
      reference: "S-001",
      status: "posted",
      lines: [
        { accountId: "1102", accountName: "Banco Nacional", debit: 3200.0, credit: 0 },
        { accountId: "4102", accountName: "Ingresos por Servicios", debit: 0, credit: 3200.0 },
      ],
    },
    {
      date: new Date("2026-06-19"),
      description: "Compra útiles de oficina",
      reference: "G-003",
      status: "void",
      lines: [
        { accountId: "5204", accountName: "Útiles y Suministros", debit: 340.0, credit: 0 },
        { accountId: "1101", accountName: "Efectivo", debit: 0, credit: 340.0 },
      ],
    },
  ];

  for (const entry of journalEntriesData) {
    await prisma.journalEntry.create({ data: entry });
  }
  console.log(`Seeded ${journalEntriesData.length} journal entries`);

  // Seed Payroll - Employees
  const employeesData = [
    { name: "María García", email: "maria@empresa.com", phone: "+58 412-1234567", position: "Gerente General", department: "Dirección", salary: 4500, hireDate: new Date("2022-03-15"), status: "active", avatar: "👩‍💼", address: "Av. Principal, Caracas", birthDate: new Date("1985-06-20"), bloodType: "O+", emergencyContact: "Juan García", emergencyPhone: "+58 412-7654321" },
    { name: "Carlos López", email: "carlos@empresa.com", phone: "+58 414-2345678", position: "Contador", department: "Finanzas", salary: 2800, hireDate: new Date("2023-01-10"), status: "active", avatar: "👨‍💻", address: "Calle 5, Maracaibo", birthDate: new Date("1990-11-05"), bloodType: "A+", emergencyContact: "Ana López", emergencyPhone: "+58 414-8765432" },
    { name: "Ana Martínez", email: "ana@empresa.com", phone: "+58 424-3456789", position: "Cajera", department: "Ventas", salary: 1200, hireDate: new Date("2024-06-01"), status: "active", avatar: "👩‍🔬", address: "Urb. El Rosal, Valencia", birthDate: new Date("1995-03-12"), bloodType: "B+", emergencyContact: "Pedro Martínez", emergencyPhone: "+58 424-9876543" },
    { name: "Pedro Sánchez", email: "pedro@empresa.com", phone: "+58 412-4567890", position: "Cocinero", department: "Cocina", salary: 1500, hireDate: new Date("2023-09-20"), status: "active", avatar: "👨‍🍳", address: "Av. Bolívar, Barquisimeto", birthDate: new Date("1988-07-25"), bloodType: "AB+", emergencyContact: "Laura Sánchez", emergencyPhone: "+58 412-0987654" },
    { name: "Laura Rodríguez", email: "laura@empresa.com", phone: "+58 414-5678901", position: "Mesera", department: "Servicio", salary: 1100, hireDate: new Date("2024-02-14"), status: "on_leave", avatar: "👩‍🎨", address: "Calle Principal, Mérida", birthDate: new Date("1992-09-08"), bloodType: "O-", emergencyContact: "Roberto Rodríguez", emergencyPhone: "+58 414-1098765" },
    { name: "Jorge Hernández", email: "jorge@empresa.com", phone: "+58 424-6789012", position: "Almacenero", department: "Almacén", salary: 1300, hireDate: new Date("2023-07-05"), status: "active", avatar: "👨‍🔧", address: "Urb. Las Mercedes, Caracas", birthDate: new Date("1987-12-01"), bloodType: "A-", emergencyContact: "Carmen Hernández", emergencyPhone: "+58 424-2109876" },
    { name: "Carmen Díaz", email: "carmen@empresa.com", phone: "+58 412-7890123", position: "Asistente Administrativo", department: "Administración", salary: 1400, hireDate: new Date("2024-01-15"), status: "active", avatar: "👩‍💼", address: "Av. Libertador, Caracas", birthDate: new Date("1993-04-18"), bloodType: "B-", emergencyContact: "Miguel Díaz", emergencyPhone: "+58 412-3210987" },
    { name: "Roberto Torres", email: "roberto@empresa.com", phone: "+58 414-8901234", position: "Técnico de Mantenimiento", department: "Operaciones", salary: 1600, hireDate: new Date("2023-04-22"), status: "active", avatar: "👨‍🏭", address: "Calle 8, San Cristóbal", birthDate: new Date("1986-08-30"), bloodType: "O+", emergencyContact: "Isabel Torres", emergencyPhone: "+58 414-4321098" },
    { name: "Miguel Ángel Reyes", email: "miguel@empresa.com", phone: "+58 424-9012345", position: "Vendedor", department: "Ventas", salary: 1300, hireDate: new Date("2024-03-10"), status: "active", avatar: "🧑‍💼", address: "Urb. El Parque, Barinas", birthDate: new Date("1991-02-14"), bloodType: "A+", emergencyContact: "Ana Reyes", emergencyPhone: "+58 424-5432109" },
    { name: "Isabel Flores", email: "isabel@empresa.com", phone: "+58 412-0123456", position: "Recepcionista", department: "Administración", salary: 1000, hireDate: new Date("2024-07-01"), status: "terminated", avatar: "👩‍🏫", address: "Av. 5 de Julio, Caracas", birthDate: new Date("1994-10-22"), bloodType: "AB-", emergencyContact: "Carlos Flores", emergencyPhone: "+58 412-6543210" },
  ];

  for (const emp of employeesData) {
    await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: emp,
    });
  }
  console.log(`Seeded ${employeesData.length} employees`);

  // Seed Payroll - Attendance Records
  const attendanceData = [
    { employeeId: "maria@empresa.com", employeeName: "María García", date: new Date("2026-06-23"), clockIn: "08:00", clockOut: "17:00", hoursWorked: 9, status: "present" },
    { employeeId: "carlos@empresa.com", employeeName: "Carlos López", date: new Date("2026-06-23"), clockIn: "08:15", clockOut: "17:00", hoursWorked: 8.75, status: "late" },
    { employeeId: "ana@empresa.com", employeeName: "Ana Martínez", date: new Date("2026-06-23"), clockIn: "09:00", clockOut: "17:00", hoursWorked: 8, status: "present" },
    { employeeId: "pedro@empresa.com", employeeName: "Pedro Sánchez", date: new Date("2026-06-23"), clockIn: "07:30", clockOut: "15:30", hoursWorked: 8, status: "present" },
    { employeeId: "laura@empresa.com", employeeName: "Laura Rodríguez", date: new Date("2026-06-23"), clockIn: "", clockOut: null, hoursWorked: 0, status: "absent" },
    { employeeId: "jorge@empresa.com", employeeName: "Jorge Hernández", date: new Date("2026-06-23"), clockIn: "08:00", clockOut: "13:00", hoursWorked: 5, status: "half_day" },
    { employeeId: "carmen@empresa.com", employeeName: "Carmen Díaz", date: new Date("2026-06-23"), clockIn: "08:00", clockOut: "17:00", hoursWorked: 9, status: "present" },
    { employeeId: "roberto@empresa.com", employeeName: "Roberto Torres", date: new Date("2026-06-23"), clockIn: "07:45", clockOut: "16:45", hoursWorked: 9, status: "present" },
    { employeeId: "miguel@empresa.com", employeeName: "Miguel Ángel Reyes", date: new Date("2026-06-23"), clockIn: "08:30", clockOut: "17:30", hoursWorked: 9, status: "present" },
    { employeeId: "isabel@empresa.com", employeeName: "Isabel Flores", date: new Date("2026-06-23"), clockIn: "", clockOut: null, hoursWorked: 0, status: "absent" },
    { employeeId: "maria@empresa.com", employeeName: "María García", date: new Date("2026-06-22"), clockIn: "08:00", clockOut: "17:00", hoursWorked: 9, status: "present" },
    { employeeId: "carlos@empresa.com", employeeName: "Carlos López", date: new Date("2026-06-22"), clockIn: "08:00", clockOut: "17:00", hoursWorked: 9, status: "present" },
    { employeeId: "ana@empresa.com", employeeName: "Ana Martínez", date: new Date("2026-06-22"), clockIn: "09:30", clockOut: "17:00", hoursWorked: 7.5, status: "late" },
    { employeeId: "pedro@empresa.com", employeeName: "Pedro Sánchez", date: new Date("2026-06-22"), clockIn: "07:30", clockOut: "15:30", hoursWorked: 8, status: "present" },
    { employeeId: "laura@empresa.com", employeeName: "Laura Rodríguez", date: new Date("2026-06-22"), clockIn: "08:00", clockOut: "17:00", hoursWorked: 9, status: "present" },
  ];

  for (const record of attendanceData) {
    // Use employee email as a temporary ID lookup
    const emp = await prisma.employee.findUnique({ where: { email: record.employeeId } });
    if (emp) {
      await prisma.attendanceRecord.create({
        data: {
          employeeId: emp.id,
          employeeName: record.employeeName,
          date: record.date,
          clockIn: record.clockIn,
          clockOut: record.clockOut,
          hoursWorked: record.hoursWorked,
          status: record.status,
        },
      });
    }
  }
  console.log(`Seeded ${attendanceData.length} attendance records`);

  // Seed Payroll - Leave Requests
  const leaveRequestsData = [
    { employeeId: "laura@empresa.com", employeeName: "Laura Rodríguez", type: "vacation", startDate: new Date("2026-06-23"), endDate: new Date("2026-06-27"), days: 5, reason: "Vacaciones anuales", status: "approved", approvedBy: "María García" },
    { employeeId: "ana@empresa.com", employeeName: "Ana Martínez", type: "sick", startDate: new Date("2026-06-24"), endDate: new Date("2026-06-25"), days: 2, reason: "Consulta médica", status: "pending", approvedBy: null },
    { employeeId: "roberto@empresa.com", employeeName: "Roberto Torres", type: "personal", startDate: new Date("2026-06-28"), endDate: new Date("2026-06-28"), days: 1, reason: "Trámite personal", status: "approved", approvedBy: "María García" },
    { employeeId: "jorge@empresa.com", employeeName: "Jorge Hernández", type: "sick", startDate: new Date("2026-06-20"), endDate: new Date("2026-06-20"), days: 1, reason: "Malestar estomacal", status: "approved", approvedBy: "María García" },
    { employeeId: "miguel@empresa.com", employeeName: "Miguel Ángel Reyes", type: "vacation", startDate: new Date("2026-07-01"), endDate: new Date("2026-07-10"), days: 10, reason: "Vacaciones familiares", status: "pending", approvedBy: null },
    { employeeId: "carmen@empresa.com", employeeName: "Carmen Díaz", type: "personal", startDate: new Date("2026-06-15"), endDate: new Date("2026-06-15"), days: 1, reason: "Cita odontológica", status: "approved", approvedBy: "Carlos López" },
  ];

  for (const leave of leaveRequestsData) {
    const emp = await prisma.employee.findUnique({ where: { email: leave.employeeId } });
    if (emp) {
      await prisma.leaveRequest.create({
        data: {
          employeeId: emp.id,
          employeeName: leave.employeeName,
          type: leave.type,
          startDate: leave.startDate,
          endDate: leave.endDate,
          days: leave.days,
          reason: leave.reason,
          status: leave.status,
          approvedBy: leave.approvedBy,
        },
      });
    }
  }
  console.log(`Seeded ${leaveRequestsData.length} leave requests`);

  // Seed Payroll - Payroll Records
  const payrollRecordsData = [
    { employeeId: "maria@empresa.com", employeeName: "María García", period: "Jun 2026", baseSalary: 4500, bonuses: 500, deductions: 225, tax: 675, netPay: 4100, status: "paid", paidDate: new Date("2026-06-15") },
    { employeeId: "carlos@empresa.com", employeeName: "Carlos López", period: "Jun 2026", baseSalary: 2800, bonuses: 200, deductions: 140, tax: 420, netPay: 2440, status: "paid", paidDate: new Date("2026-06-15") },
    { employeeId: "ana@empresa.com", employeeName: "Ana Martínez", period: "Jun 2026", baseSalary: 1200, bonuses: 0, deductions: 60, tax: 180, netPay: 960, status: "paid", paidDate: new Date("2026-06-15") },
    { employeeId: "pedro@empresa.com", employeeName: "Pedro Sánchez", period: "Jun 2026", baseSalary: 1500, bonuses: 150, deductions: 75, tax: 225, netPay: 1350, status: "paid", paidDate: new Date("2026-06-15") },
    { employeeId: "laura@empresa.com", employeeName: "Laura Rodríguez", period: "Jun 2026", baseSalary: 1100, bonuses: 100, deductions: 55, tax: 165, netPay: 980, status: "pending", paidDate: null },
    { employeeId: "jorge@empresa.com", employeeName: "Jorge Hernández", period: "Jun 2026", baseSalary: 1300, bonuses: 0, deductions: 65, tax: 195, netPay: 1040, status: "pending", paidDate: null },
    { employeeId: "carmen@empresa.com", employeeName: "Carmen Díaz", period: "Jun 2026", baseSalary: 1400, bonuses: 100, deductions: 70, tax: 210, netPay: 1220, status: "held", paidDate: null },
    { employeeId: "roberto@empresa.com", employeeName: "Roberto Torres", period: "Jun 2026", baseSalary: 1600, bonuses: 200, deductions: 80, tax: 240, netPay: 1480, status: "pending", paidDate: null },
  ];

  for (const record of payrollRecordsData) {
    const emp = await prisma.employee.findUnique({ where: { email: record.employeeId } });
    if (emp) {
      await prisma.payrollRecord.create({
        data: {
          employeeId: emp.id,
          employeeName: record.employeeName,
          period: record.period,
          baseSalary: record.baseSalary,
          bonuses: record.bonuses,
          deductions: record.deductions,
          tax: record.tax,
          netPay: record.netPay,
          status: record.status,
          paidDate: record.paidDate,
        },
      });
    }
  }
  console.log(`Seeded ${payrollRecordsData.length} payroll records`);
}

main().finally(() => prisma.$disconnect());
