"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/Authprovider";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('showModal') === 'true') {
      setShowModal(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const success = await login(email, senha);
    if (!success) {
      setMsg("E-mail ou senha inválidos.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Olá!</h2>
            <p className="mb-4">Para acessar seu perfil você deve estar logado</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition cursor-pointer"
            >
              Fazer Login
            </button>
          </div>
        </div>
      )}

      {/* Área esquerda - informações */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-10 text-center">
        <img
          src="/images/logo_impressa_digital.png"
          alt="Logo"
          className="w-100 mb-6"
        />
        <p className="text-gray-600 text-xl max-w-md">
          Na Impressa Digital, você transforma ideias em personalizados únicos
          e celebra momentos inesquecíveis.
        </p>
      </div>

      {/* Área direita - Card de login */}
      <div className="flex flex-1 items-center justify-center p-8">
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
            <p className="text-sm text-gray-500">
              Esqueceu sua senha?{" "}
              <Link href="/forgot_password" className="text-sm text-green-600">
                Recuperar senha
              </Link>
            </p>
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
