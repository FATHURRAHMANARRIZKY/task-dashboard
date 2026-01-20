import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || undefined;

  const skip = (page - 1) * limit;

  try {
    const whereCondition = {
      userId: user.id,
      title: { contains: search, mode: "insensitive" as const },
      ...(status ? { status: status as any } : {}),
    };

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count({ where: whereCondition }),
    ]);

    return NextResponse.json({
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const newTask = await prisma.task.create({
    data: {
      title: body.title,
      description: body.description || "",
      status: body.status || "TODO",
      priority: body.priority || "MEDIUM",
      userId: user.id,
    },
  });
  return NextResponse.json(newTask);
}
