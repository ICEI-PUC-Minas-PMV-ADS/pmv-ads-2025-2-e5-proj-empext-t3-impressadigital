import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_super_secreta";

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  name: string;
}

export async function getServerUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const secret = new TextEncoder().encode(JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    const user = payload as unknown as AuthUser;

    if (!user.id || !user.email || !user.role || !user.name) return null;

    return user;
  } catch {
    return null;
  }
}
