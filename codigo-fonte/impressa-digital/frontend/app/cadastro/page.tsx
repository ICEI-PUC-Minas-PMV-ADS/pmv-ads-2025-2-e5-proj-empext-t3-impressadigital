"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

    function formatPhone(value: string) {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 11);
    if (value.length <= 10) {
      // fixo (XX) XXXX-XXXX
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      // celular (XX) 9XXXX-XXXX
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
    return value.trim();
  }


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "cpf") {
      newValue = formatCPF(value);
      if (newValue.length < 14) {
        setCpfError("Preencha o CPF completo (11 dígitos).");
      } else {
        setCpfError("");
      }
    }

    if (name === "phone") {
      newValue = formatPhone(value);
    }

    setForm({ ...form, [name]: newValue });
  }

  

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    if (form.cpf.replace(/\D/g, "").length !== 11) {
      setCpfError("Preencha o CPF completo (11 dígitos).");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          role: "cliente",
        }),
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

        setTimeout(() => {
          router.push("/login"); 
        }, 1500);
      } else {
        const error = await res.json();
        setMsg(error.message || "Erro ao cadastrar.");
      }
    } catch (err) {
      setMsg("Erro de conexão com o servidor.");
    }
    setLoading(false);
  }

  function formatCPF(value: string) {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        {/* Logo */}
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

        {/* Formulário */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nome de usuário"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800"
          />

          <input
            type="date"
            name="birthDate"
            placeholder="Data de nascimento"
            value={form.birthDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
          />

          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={form.cpf}
            onChange={handleChange}
            required
            maxLength={14}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800"
          />
          {cpfError && (
            <div className="text-red-500 text-xs mt-1">{cpfError}</div>
          )}
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Telefone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800"
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800"
          />

          {/* Termos e condições */}
          <p className="text-xs text-gray-400 leading-snug">
            As pessoas que usam nosso serviço podem ter carregado suas informações de contato na
            Impressa Digital. Saiba mais. <br />
            Ao clicar em Cadastre-se, você concorda com nossos Termos, Política de Privacidade e
            Política de Cookies. Você poderá receber notificações por SMS e cancelar isso quando quiser.
          </p>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md"
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