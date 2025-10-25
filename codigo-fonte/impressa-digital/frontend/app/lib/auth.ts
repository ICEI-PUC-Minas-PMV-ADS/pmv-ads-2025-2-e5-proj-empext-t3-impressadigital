import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_super_secreta";

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  name: string;
}

export function getServerUser(): AuthUser | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value; 

    if (!token) return null;

    const payload = jwt.verify(token, JWT_SECRET) as AuthUser;
    return payload;
  } catch {
    return null;
  }
}
