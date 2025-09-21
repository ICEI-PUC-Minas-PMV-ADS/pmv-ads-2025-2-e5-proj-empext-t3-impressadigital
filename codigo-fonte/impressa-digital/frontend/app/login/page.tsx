"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMsg("");
      if (!email.trim() || !senha.trim()) {
    setMsg("Preencha todos os campos obrigatórios.");
    return;
  }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: senha,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id.toString());
        localStorage.setItem("user", JSON.stringify(data.user));

        setMsg("Login realizado com sucesso!");
        router.push("/perfil");

      } else {
        setMsg(data.message || "E-mail ou senha inválidos.");
      }
    } catch (err) {
      setMsg("Erro de conexão com o servidor.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen justify-center bg-white">
      {/* Área da esquerda */}
      <div className="flex flex-col items-center justify-center w-1/2 p-10 text-center">
        <img src="/images/logo_impressa_digital.png" alt="Logo" className="w-100 mb-6" />
        <p className="text-gray-600 text-xl max-w-md justify-center" >
          Na Impressa Digital, você transforma ideias em personalizados únicos
          e celebra momentos inesquecíveis.
        </p>
      </div>

      {/* Área da direita - Card de login */}
      <div className="flex w-1/2 items-center justify-center">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
             focus:outline-none focus:ring-2 focus:ring-green-500 
             placeholder-gray-400 text-gray-800"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
             focus:outline-none focus:ring-2 focus:ring-green-500 
             placeholder-gray-400 text-gray-800"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {msg && (
            <div className="mt-4 text-center text-sm text-red-600">{msg}</div>
          )}

          <div className="text-center mt-4">
            <Link href="/recuperar-senha" className="text-sm text-gray-500">
              Recuperar senha
            </Link>
          </div>

          <div className="border-t mt-6 pt-4 text-center">
            <p className="text-sm text-gray-500">
              Ainda não tem uma conta?{" "}
              <Link href="/cadastro" className="text-green-600 font-medium">
                Quero fazer parte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}