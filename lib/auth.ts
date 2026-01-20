import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET || "secret-default";
const key = new TextEncoder().encode(secretKey);

export async function createSession(payload: {
  userId: string;
  email: string;
}) {
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);

  const cookieStore = await cookies();

  cookieStore.set("auth_session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

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

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
}

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_session")?.value;
  const session = await verifySession(token);

  if (!session || !session.userId) return null;

  try {
    const { prisma } = await import("@/lib/prisma");

    const user = await prisma.user.findUnique({
      where: { id: String(session.userId) },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
}
