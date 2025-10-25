"use client";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "../../contexts/Authprovider";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
  redirectDeniedTo?: string; 
}

export function ProtectedRoute({
  children,
  roles,
  redirectDeniedTo = "/acesso-negado",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (roles && !roles.includes(user.role || "")) {
        if (user.role === "cliente") {
          router.back();
        } else {
          router.replace(redirectDeniedTo);
        }
      } else {
        setAllowed(true);
      }
    }
  }, [user, loading, roles, router, redirectDeniedTo]);

  if (!allowed) return null;

  return <>{children}</>;
}
