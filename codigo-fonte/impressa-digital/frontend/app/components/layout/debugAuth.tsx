// components/DebugAuth.tsx
"use client";
import { useAuth } from "../../contexts/Authprovider";

export default function DebugAuth() {
  const { user, loading } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs">
      <div>Loading: {loading ? "Sim" : "Não"}</div>
      <div>Usuário: {user ? user.email : "Nenhum"}</div>
      <div>Role: {user?.role || "Nenhuma"}</div>
    </div>
  );
}