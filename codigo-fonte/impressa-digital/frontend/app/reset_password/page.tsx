"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Regras da senha
  const passwordRules = [
    { test: (pwd: string) => /[A-Z]/.test(pwd), label: "Letra maiúscula" },
    { test: (pwd: string) => /\d/.test(pwd), label: "Número" },
    { test: (pwd: string) => pwd.length >= 8, label: "8 caracteres" },
    {
      test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      label: "Caractere especial",
    },
  ];

  const isStrongPassword = (pwd: string) =>
    passwordRules.every((rule) => rule.test(pwd));

  const strengthPercent = () => {
    const passedCount = passwordRules.filter((rule) => rule.test(password))
      .length;
    return (passedCount / passwordRules.length) * 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Token inválido.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/password-reset/reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao redefinir a senha");
      }

      setMessage(data.message);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-6">
        <img
          src="/images/logo_impressa_digital.png"
          alt="Logo"
          className="w-60 mb-6"
        />
      </div>

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Redefinir Senha</h1>
        <p className="text-gray-600 mb-6 text-center">
          Digite sua nova senha abaixo.
        </p>

        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Nova Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="Digite sua nova senha"
              required
            />

            {/* Barra de força animada */}
            <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  strengthPercent() < 50
                    ? "bg-red-500"
                    : strengthPercent() < 100
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
                style={{ width: `${strengthPercent()}%` }}
              />
            </div>

            {/* Indicadores de senha */}
            <div className="mt-2 flex flex-col gap-1 text-sm">
              {passwordRules.map((rule, index) => {
                const passed = rule.test(password);
                return (
                  <span
                    key={index}
                    className={`flex items-center gap-1 transition-colors ${
                      passed ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {passed ? (
                      <AiOutlineCheckCircle className="animate-pulse" />
                    ) : (
                      <AiOutlineCloseCircle />
                    )}
                    {rule.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="Confirme sua nova senha"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "Redefinindo..." : "Redefinir Senha"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Lembrou sua senha?{" "}
          <Link href="/login" className="text-green-500">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
