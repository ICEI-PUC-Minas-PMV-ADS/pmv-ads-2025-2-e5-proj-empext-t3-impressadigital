"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/Authprovider";
import {
  FaUser,
  FaBirthdayCake,
  FaIdCard,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaHome,
  FaCity,
  FaBuilding,
} from "react-icons/fa";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 text-white ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
};

interface Address {
  id?: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

const EditarPerfil: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    cpf: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [address, setAddress] = useState<Address>({
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [cpfError, setCpfError] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
  };

  // Regras de senha forte
  const passwordRules = [
    { test: (pwd: string) => /[A-Z]/.test(pwd), label: "Letra maiúscula" },
    { test: (pwd: string) => /\d/.test(pwd), label: "Número" },
    { test: (pwd: string) => pwd.length >= 8, label: "8 caracteres" },
    {
      test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      label: "Caractere especial",
    },
  ];

  const passwordStrength = () => {
    if (!form.password) return 0;
    const passedCount = passwordRules.filter((rule) =>
      rule.test(form.password)
    ).length;
    return (passedCount / passwordRules.length) * 100;
  };

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        birthDate: user.birthDate ? user.birthDate.slice(0, 10) : "",
        cpf: user.cpf ? formatCPF(user.cpf) : "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
      loadUserAddress();
    }
  }, [user]);

  const loadUserAddress = async () => {
    if (!user) return;
    try {
      setAddressLoading(true);
      const response = await fetch(
        `http://localhost:3000/customer_address/user/${user.id}`,
        { credentials: "include" }
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.length) setAddress(data[0]);
      }
    } catch {
      showToast("Erro ao carregar endereço", "error");
    } finally {
      setAddressLoading(false);
    }
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    let newValue = name === "cpf" ? formatCPF(value) : value;
    if (name === "cpf")
      setCpfError(
        newValue.length < 14 ? "Preencha o CPF completo (11 dígitos)." : ""
      );
    setForm({ ...form, [name]: newValue });
  }

  function handleAddressChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: name === "cep" ? formatCEP(value) : value,
    });
  }

  function formatCPF(value: string) {
    value = value.replace(/\D/g, "").slice(0, 11);
    return value
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatCEP(value: string) {
    value = value.replace(/\D/g, "").slice(0, 8);
    return value.replace(/(\d{5})(\d)/, "$1-$2");
  }

  const estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cpfError) return;
    if (form.password && form.password !== form.confirmPassword) {
      showToast("As senhas não coincidem.", "error");
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        name: form.name,
        birthDate: form.birthDate,
        cpf: form.cpf,
        email: form.email,
      };

      if (form.password && form.password.trim() !== "") {
        // Validação de senha forte
        if (!passwordRules.every((rule) => rule.test(form.password))) {
          showToast(
            "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.",
            "error"
          );
          setLoading(false);
          return;
        }
        payload.password = form.password;
      }

      const res = await fetch(`http://localhost:3000/users/${user?.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("Dados pessoais atualizados com sucesso!", "success");
        setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        const data = await res.json();
        showToast(data.message || "Erro ao atualizar os dados.", "error");
      }
    } catch {
      showToast("Erro ao conectar com o servidor.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressLoading(true);

    try {
      const method = address.id ? "PUT" : "POST";
      const url = address.id
        ? `http://localhost:3000/customer_address/${address.id}`
        : `http://localhost:3000/customer_address`;

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...address, userId: user?.id }),
      });

      if (res.ok) {
        showToast("Endereço salvo com sucesso!", "success");
        if (!address.id) loadUserAddress();
      } else {
        const data = await res.json();
        showToast(data.message || "Erro ao salvar o endereço.", "error");
      }
    } catch {
      showToast("Erro ao conectar com o servidor.", "error");
    } finally {
      setAddressLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-4 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Editar Cadastro
        </h1>
        <p className="text-gray-500 text-center mt-1">É rápido e fácil!</p>

        {/* Dados Pessoais */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Dados Pessoais
          </h2>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleSubmit}
          >
            {[
              { field: "name", icon: <FaUser />, placeholder: "Nome completo" },
              {
                field: "birthDate",
                icon: <FaBirthdayCake />,
                placeholder: "Data de nascimento",
                type: "date",
              },
              {
                field: "cpf",
                icon: <FaIdCard />,
                placeholder: "CPF",
                readOnly: true,
              },
              { field: "email", icon: <FaEnvelope />, placeholder: "E-mail" },
            ].map(({ field, icon, placeholder, type, readOnly }) => (
              <div key={field} className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {icon}
                </div>
                <input
                  type={type || "text"}
                  name={field}
                  value={form[field as keyof typeof form]}
                  onChange={handleChange}
                  maxLength={field === "cpf" ? 14 : undefined}
                  required={field !== "password" && !readOnly}
                  readOnly={readOnly}
                  className={`peer w-full pl-10 pr-3 pt-4 pb-2 rounded-md border border-gray-300 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    readOnly
                      ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                      : "bg-white text-gray-800"
                  }`}
                  placeholder={placeholder}
                />
                <label className="absolute left-10 -top-0 text-gray-400 text-xs transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-0 peer-focus:text-green-600 peer-focus:text-xs pointer-events-none">
                  {placeholder}
                </label>
              </div>
            ))}

            {/* Senha e confirmação */}
            <div className="relative col-span-full md:flex md:gap-4">
              {/* Senha */}
              <div className="relative flex-1">
                <div className="absolute left-3 top-4 text-gray-400">
                  <FaLock />
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Senha"
                  className="peer w-full pl-10 pr-3 pt-4 pb-2 h-12 rounded-md border border-gray-300 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                />
                <label className="absolute left-10 top-4 text-gray-400 text-xs transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-0 peer-focus:text-green-600 peer-focus:text-xs pointer-events-none">
                  Senha (deixe em branco para manter a atual)
                </label>

                {/* Validadores de senha animados */}
                <div
                  className={`mt-2 transition-all duration-500 ease-out overflow-hidden ${
                    form.password ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
                  }`}
                >
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ease-out ${
                        passwordStrength() < 50
                          ? "bg-red-500"
                          : passwordStrength() < 100
                          ? "bg-yellow-400"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${passwordStrength()}%` }}
                    />
                  </div>

                  <div className="mt-1 flex flex-col gap-1 text-sm">
                    {passwordRules.map((rule, idx) => {
                      const passed = rule.test(form.password);
                      return (
                        <span
                          key={idx}
                          className={`flex items-center gap-1 transition-all duration-500 transform ${
                            passed
                              ? "text-green-600 translate-y-1 opacity-100"
                              : "text-red-500 translate-y-1 opacity-100"
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
              </div>

              {/* Confirmar senha */}
              <div className="relative flex-1 mt-4 md:mt-0">
                <div className="absolute left-3 top-4 text-gray-400">
                  <FaLock />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword || ""}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="Confirme a senha"
                  className="peer w-full pl-10 pr-3 pt-4 pb-2 rounded-md border border-gray-300 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                />
                <label className="absolute left-10 top-4 text-gray-400 text-xs transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-0 peer-focus:text-green-600 peer-focus:text-xs pointer-events-none">
                  Confirme a senha
                </label>
                {form.confirmPassword &&
                  form.confirmPassword !== form.password && (
                    <span className="text-red-500 text-xs mt-1 block transition-opacity duration-500 opacity-100">
                      As senhas não coincidem
                    </span>
                  )}
              </div>
            </div>

            {cpfError && (
              <div className="text-red-500 text-sm col-span-full">
                {cpfError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="col-span-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition-colors disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar Dados Pessoais"}
            </button>
          </form>
        </div>

        {/* Endereço */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Endereço {address.id ? "Cadastrado" : ""}
          </h2>
          {addressLoading ? (
            <p className="text-center py-8 text-gray-600">
              Carregando endereço...
            </p>
          ) : (
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleAddressSubmit}
            >
              {[
                {
                  field: "cep",
                  icon: <FaMapMarkerAlt />,
                  placeholder: "CEP *",
                },
                {
                  field: "logradouro",
                  icon: <FaHome />,
                  placeholder: "Logradouro *",
                },
                {
                  field: "numero",
                  icon: <FaBuilding />,
                  placeholder: "Número *",
                },
                { field: "bairro", icon: <FaCity />, placeholder: "Bairro *" },
                { field: "cidade", icon: <FaCity />, placeholder: "Cidade *" },
              ].map(({ field, icon, placeholder }) => (
                <div key={field} className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                  </div>
                  <input
                    type="text"
                    name={field}
                    value={address[field as keyof Address]}
                    onChange={handleAddressChange}
                    required
                    className="peer w-full pl-10 pr-3 pt-3 pb-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-transparent text-gray-800"
                    placeholder={placeholder}
                  />
                  <label className="absolute left-10 top-0 text-gray-400 text-xs transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-green-600 peer-focus:text-xs pointer-events-none">
                    {placeholder}
                  </label>
                </div>
              ))}
              <select
                name="estado"
                value={address.estado}
                onChange={handleAddressChange}
                required
                className="w-full pl-3 pr-3 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              >
                <option value="">Estado *</option>
                {estados.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={addressLoading}
                className="col-span-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition-colors disabled:opacity-50"
              >
                {addressLoading
                  ? "Salvando..."
                  : address.id
                  ? "Atualizar Endereço"
                  : "Salvar Endereço"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* TOAST */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default EditarPerfil;
