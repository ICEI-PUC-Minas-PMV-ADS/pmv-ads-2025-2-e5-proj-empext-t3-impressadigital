"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/Authprovider";

const EditarPerfil: React.FC = () => {
  const { user } = useAuth(); // 👈 pega o usuário do contexto
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    cpf: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [cpfError, setCpfError] = useState("");

  // Preenche o form com os dados do usuário ao carregar
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        birthDate: (user as any).birthDate ? (user as any).birthDate.slice(0, 10) : "",
        cpf: (user as any).cpf || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

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

    setForm({ ...form, [name]: newValue });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    if (!user) {
      setMsg("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    if (form.cpf.replace(/\D/g, "").length !== 11) {
      setCpfError("Preencha o CPF completo (11 dígitos).");
      setLoading(false);
      return;
    }

    try {
      const body: { password?: string } = { ...form };
      if (!form.password) {
        delete body.password;
      }

      const res = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 👈 envia cookie automaticamente
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMsg("Dados atualizados com sucesso!");
      } else {
        const error = await res.json();
        setMsg(
          Array.isArray(error.message)
            ? error.message.join(", ")
            : error.message || "Erro ao atualizar dados."
        );
      }
    } catch {
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
    <div className="flex justify-center">
      <div className="bg-white p-15 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Editar Cadastro
        </h1>
        <p className="text-gray-500 text-center text-sm mt-1">
          É rápido e fácil!
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nome de usuário"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800"
          />

          <input
            type="date"
            name="birthDate"
            placeholder="Data de nascimento"
            value={form.birthDate}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
          />

          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={form.cpf}
            onChange={handleChange}
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
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800"
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800"
          />

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
        {msg && (
          <div className="mt-4 text-center text-sm text-green-600">{msg}</div>
        )}
      </div>
    </div>
  );
};

export default EditarPerfil;
