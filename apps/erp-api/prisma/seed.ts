import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@openerp.local";
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return; // ponytail: idempotent, safe to re-run

  const hash = await bcrypt.hash("admin", 10);
  await prisma.user.create({
    data: { name: "Admin", email, password: hash },
  });
  console.log("Seeded admin user");
}

main().finally(() => prisma.$disconnect());