// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  // 1. Bersihkan data lama
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // 2. Buat Password Hash
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 3. Buat 1 User Dummy
  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      password: hashedPassword,
      name: "Demo User",
    },
  });

  console.log(`👤 Created user: ${user.email}`);

  // 4. Buat 10 Task Dummy menggunakan String Manual
  // Kita gunakan 'as any' agar TypeScript tidak protes soal tipe Enum
  const tasksData: any[] = [
    {
      title: "Setup Project Next.js",
      status: "DONE",
      priority: "HIGH",
    },
    {
      title: "Install Tanstack Query",
      status: "DONE",
      priority: "HIGH",
    },
    {
      title: "Desain Database Prisma",
      status: "IN_PROGRESS",
      priority: "HIGH",
    },
    {
      title: "Beli Kopi Susu",
      status: "TODO",
      priority: "LOW",
    },
    {
      title: "Meeting dengan Client",
      status: "TODO",
      priority: "MEDIUM",
    },
    {
      title: "Fixing Bug Navbar",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
    },
    {
      title: "Bayar Tagihan Internet",
      status: "TODO",
      priority: "HIGH",
    },
    {
      title: "Update LinkedIn",
      status: "TODO",
      priority: "LOW",
    },
    {
      title: "Belajar Tanstack Table",
      status: "TODO",
      priority: "MEDIUM",
    },
    {
      title: "Deploy ke Vercel",
      status: "TODO",
      priority: "HIGH",
    },
  ];

  for (const task of tasksData) {
    await prisma.task.create({
      data: {
        title: task.title,
        status: task.status, // Prisma akan otomatis convert string ke Enum
        priority: task.priority, // Prisma akan otomatis convert string ke Enum
        userId: user.id,
      },
    });
  }

  console.log(`📝 Created ${tasksData.length} tasks`);
  console.log("✅ Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
