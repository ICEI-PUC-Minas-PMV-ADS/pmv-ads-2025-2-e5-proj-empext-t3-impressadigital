"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Checa se já existe sessão ativa via cookie
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          method: "GET",
          credentials: "include", // 👈 importante
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Erro ao recuperar sessão:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 cookie vai ser gravado aqui
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      setUser(data.user);

      router.push("/perfil");
      return true;
    } catch (error) {
      console.error("Erro de login:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include", // 👈 backend remove cookie
      });
    } catch (err) {
      console.error("Erro no logout:", err);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
