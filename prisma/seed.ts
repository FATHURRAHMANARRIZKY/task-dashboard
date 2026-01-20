// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // const hashedPassword = await bcrypt.hash("password123", 10);

  // const user = await prisma.user.create({
  //   data: {
  //     email: "demo@example.com",
  //     password: hashedPassword,
  //     name: "Demo User",
  //   },
  // });

  // const tasksData = Array.from({ length: 25 }).map((_, i) => ({
  //   title: `Task Dummy Nomor ${i + 1}`,
  //   description: `Ini adalah deskripsi panjang untuk task nomor ${i + 1} agar terlihat penuh di detail page.`,
  //   status: i % 3 === 0 ? "DONE" : i % 2 === 0 ? "IN PROGRESS" : "TODO",
  //   priority: i % 5 === 0 ? "HIGH" : i % 3 === 0 ? "LOW" : "MEDIUM",
  //   userId: user.id,
  // }));

  // await prisma.task.createMany({
  //   data: tasksData as any,
  // });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
