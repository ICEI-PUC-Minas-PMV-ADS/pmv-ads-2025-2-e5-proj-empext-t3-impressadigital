"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function Cadastro() {
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    cpf: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [cpfError, setCpfError] = useState("");

  const router = useRouter();

  const passwordRules = [
    { label: "Mínimo 6 caracteres", test: (p: string) => p.length >= 6 },
    { label: "Uma letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Um número", test: (p: string) => /[0-9]/.test(p) },
    {
      label: "Um caractere especial",
      test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
    },
  ];

  function formatPhone(value: string) {
    value = value.replace(/\D/g, "").slice(0, 11);
    if (value.length <= 10)
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    else value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    return value.trim();
  }

  function formatCPF(value: string) {
    value = value.replace(/\D/g, "").slice(0, 11);
    value = value
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  }

  function validateCPF(cpf: string) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let firstCheck = (sum * 10) % 11;
    if (firstCheck === 10) firstCheck = 0;
    if (firstCheck !== parseInt(cpf.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    let secondCheck = (sum * 10) % 11;
    if (secondCheck === 10) secondCheck = 0;
    if (secondCheck !== parseInt(cpf.charAt(10))) return false;
    return true;
  }

  function isPasswordStrong(password: string) {
    return passwordRules.every((rule) => rule.test(password));
  }

  function passwordStrengthPercent(password: string) {
    return (
      (passwordRules.filter((r) => r.test(password)).length /
        passwordRules.length) *
      100
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "cpf") {
      newValue = formatCPF(value);
      const cpfNumbers = newValue.replace(/\D/g, "");
      if (cpfNumbers.length < 11)
        setCpfError("Preencha o CPF completo (11 dígitos).");
      else if (!validateCPF(newValue)) setCpfError("CPF inválido.");
      else setCpfError("");
    }

    if (name === "phone") newValue = formatPhone(value);

    setForm({ ...form, [name]: newValue });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!!cpfError || !isPasswordStrong(form.password)) return;
    setLoading(true);
    setMsg("");

    const cpfNumbers = form.cpf.replace(/\D/g, "");
    if (cpfNumbers.length !== 11 || !validateCPF(form.cpf)) {
      setCpfError("CPF inválido.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "cliente" }),
      });

      if (res.ok) {
        setMsg("Cadastro realizado com sucesso!");
        setForm({
          name: "",
          birthDate: "",
          cpf: "",
          email: "",
          password: "",
          phone: "",
        });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        const error = await res.json();
        setMsg(error.message || "Erro ao cadastrar.");
      }
    } catch (err) {
      setMsg("Erro de conexão com o servidor.");
    }
    setLoading(false);
  }

  const strengthPercent = passwordStrengthPercent(form.password);
  let strengthColor = "bg-red-500";
  if (strengthPercent >= 50 && strengthPercent < 100)
    strengthColor = "bg-yellow-400";
  if (strengthPercent === 100) strengthColor = "bg-green-500";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/images/logo_impressa_digital.png"
            alt="Logo"
            width={180}
            height={80}
            className="mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-800">
            Criar uma conta
          </h1>
          <p className="text-gray-500 text-sm mt-1">É rápido e fácil!</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nome de usuário"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800"
          />

          <input
            type="date"
            name="birthDate"
            placeholder="Data de nascimento"
            value={form.birthDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
          />

          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={form.cpf}
            onChange={handleChange}
            required
            maxLength={14}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800"
          />
          {cpfError && (
            <div
              className={`text-sm mt-1 ${
                cpfError.includes("inválido") ? "text-red-500" : "text-gray-500"
              }`}
            >
              {cpfError}
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Telefone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800"
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800"
          />

          <div className="w-full h-2 bg-gray-200 rounded mt-2 mb-2 overflow-hidden">
            <div
              className={`h-2 rounded ${strengthColor} transition-all duration-500 ease-in-out`}
              style={{ width: `${strengthPercent}%` }}
            ></div>
          </div>

          <div className="space-y-1">
            {passwordRules.map((rule, index) => {
              const passed = rule.test(form.password);
              return (
                <div key={index} className="flex items-center text-sm">
                  {passed ? (
                    <FaCheck className="text-green-500 mr-2" />
                  ) : (
                    <FaTimes className="text-red-500 mr-2 animate-pulse" />
                  )}
                  <span className={passed ? "text-green-600" : "text-gray-500"}>
                    {rule.label}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 leading-snug">
            Ao clicar em Cadastre-se, você concorda com nossos Termos, Política
            de Privacidade e Política de Cookies.
          </p>

          <button
            type="submit"
            disabled={loading || !!cpfError || !isPasswordStrong(form.password)}
            className={`w-full py-3 text-white font-semibold rounded-md shadow-md ${
              !loading && !cpfError && isPasswordStrong(form.password)
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Cadastrando..." : "Cadastre-se"}
          </button>
        </form>

        {msg && (
          <div className="mt-4 text-center text-sm text-green-600">{msg}</div>
        )}
      </div>
    </div>
  );
}
