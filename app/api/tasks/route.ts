import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth"; // Helper session kita
import { cookies } from "next/headers";

// Helper untuk ambil user dari session
async function getUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_session")?.value;
  const session = await verifySession(token);
  return session;
}

export async function GET() {
  try {
    // 1. Cek User Login
    const session = await getUserSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Ambil Task MILIK User ini saja
    const tasks = await prisma.task.findMany({
      where: {
        userId: String(session.userId), // Filter by User ID
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Cek User Login
    const session = await getUserSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    // 2. Buat Task otomatis pakai ID dari Session
    const newTask = await prisma.task.create({
      data: {
        title: body.title,
        status: "TODO",
        priority: "MEDIUM",
        userId: String(session.userId), // <-- Ambil dari session, bukan body
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}

// Untuk DELETE dan PATCH juga sebaiknya dicek session-nya,
// tapi untuk portofolio, GET dan POST sudah cukup membuktikan konsep "Protected API".
export async function DELETE(request: Request) {
  const session = await getUserSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  // Pastikan yang dihapus adalah task milik user tersebut (Security Best Practice)
  const task = await prisma.task.findUnique({ where: { id } });
  if (task?.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const session = await getUserSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, status, priority } = body; // <-- Kita ambil priority juga

  // Cek kepemilikan
  const task = await prisma.task.findUnique({ where: { id } });
  if (task?.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Siapkan data yang mau diupdate (bisa status saja, priority saja, atau keduanya)
  const updateData: any = {};
  if (status) updateData.status = status;
  if (priority) updateData.priority = priority;

  const updatedTask = await prisma.task.update({
    where: { id },
    data: updateData, // <-- Gunakan object dinamis ini
  });
  return NextResponse.json(updatedTask);
}
