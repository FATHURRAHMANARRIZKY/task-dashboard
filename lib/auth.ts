import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET || "secret-default";
const key = new TextEncoder().encode(secretKey);

// 1. Fungsi Membuat Session (Login)
export async function createSession(payload: {
  userId: string;
  email: string;
}) {
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 Jam expire

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);

  // PERBAIKAN: Tambahkan 'await' sebelum cookies()
  const cookieStore = await cookies();

  cookieStore.set("auth_session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

// 2. Fungsi Verifikasi Session (Middleware)
export async function verifySession(token: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

// 3. Fungsi Hapus Session (Logout)
export async function deleteSession() {
  // PERBAIKAN: Tambahkan 'await' sebelum cookies()
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
}

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_session")?.value;
  const session = await verifySession(token);

  if (!session || !session.userId) return null;

  // Opsional: Ambil detail lengkap dari Database (jika butuh Nama, bukan cuma ID)
  // Kita butuh import { prisma } from '@/lib/prisma' di atas
  // Tapi biar cepat, kita asumsikan kamu mau ambil nama dari DB:

  // Pastikan import prisma ditambahkan di atas file ini:
  // import { prisma } from '@/lib/prisma'

  try {
    const user = await import("@/lib/prisma").then((m) =>
      m.prisma.user.findUnique({
        where: { id: String(session.userId) },
        select: { name: true, email: true }, // Ambil nama & email saja
      }),
    );
    return user;
  } catch (error) {
    return null;
  }
}
