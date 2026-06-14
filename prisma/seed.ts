import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@1234", 12);

  await prisma.user.upsert({
    where: { email: "admin@ecommerce.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@ecommerce.com",
      password: hashedPassword,
      role: "ADMIN",
      isEmailVerified: true,
    },
  });

  console.log("✅ Admin user seeded");
}

main().finally(() => prisma.$disconnect());