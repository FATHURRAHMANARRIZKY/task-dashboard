import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // ... kode GET yang lama biarkan saja ...
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  // ... kode POST yang lama biarkan saja ...
  const body = await request.json();
  const newTask = await prisma.task.create({
    data: {
      title: body.title,
      userId: body.userId,
      status: "TODO",
      priority: "MEDIUM",
    },
  });
  return NextResponse.json(newTask);
}

// --- TAMBAHAN BARU ---

// DELETE: Hapus task berdasarkan ID
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

// PATCH: Update status task
export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status } = body;

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json(updatedTask);
}
