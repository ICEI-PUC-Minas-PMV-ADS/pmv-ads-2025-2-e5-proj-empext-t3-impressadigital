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
  FaCheck,
} from "react-icons/fa";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { JSX } from "react";

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
  complemento?: string;
  is_primary?: boolean;
}

interface FormField {
  field: string;
  icon: JSX.Element;
  placeholder: string;
  type?: string;
  readOnly?: boolean;
}

const EditarPerfil: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    cpf: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [cpfError, setCpfError] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
  };

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
      console.log("User carregado:", user);
      setForm({
        name: user.name || "",
        birthDate: user.birthDate ? user.birthDate.slice(0, 10) : "",
        cpf: user.cpf ? formatCPF(user.cpf) : "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
      });
      loadUserAddresses();
    }
  }, [user]);

  const loadUserAddresses = async () => {
    if (!user) return;
    try {
      setAddressLoading(true);
      const response = await fetch(
        `http://localhost:3000/customer_address/user/${user.id}`,
        { credentials: "include" }
      );
      if (response.ok) {
        const data = await response.json();
        setAddresses(data || []);
      }
    } catch {
      showToast("Erro ao carregar endereços", "error");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSetPrimaryAddress = async (addressId: number) => {
    try {
      const res = await fetch(
        `http://localhost:3000/customer_address/${addressId}/set-primary`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id }),
        }
      );
      if (res.ok) {
        showToast("Endereço principal definido com sucesso!", "success");
        loadUserAddresses();
      } else {
        showToast("Erro ao definir endereço principal", "error");
      }
    } catch {
      showToast("Erro ao conectar com o servidor", "error");
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
    setEditingAddress((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "cep" ? formatCEP(value) : value,
          }
        : null
    );
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
        phone: form.phone,
      };
      if (form.password && form.password.trim() !== "") {
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
    if (!editingAddress) return;
    if (!user?.id) {
      showToast("Usuário não logado.", "error");
      return;
    }

    const requiredFields = [
      "logradouro",
      "numero",
      "bairro",
      "cidade",
      "estado",
      "cep",
    ] as const;
    for (const field of requiredFields) {
      if (!editingAddress[field] || editingAddress[field]?.trim() === "") {
        showToast(`O campo ${field} é obrigatório.`, "error");
        return;
      }
    }

    setAddressLoading(true);
    try {
      const method = editingAddress.id ? "PUT" : "POST";
      const url = editingAddress.id
        ? `http://localhost:3000/customer_address/${editingAddress.id}`
        : `http://localhost:3000/customer_address`;
      const payload: Partial<Address> & { user_id: number } = {
        logradouro: editingAddress.logradouro.trim(),
        numero: editingAddress.numero.trim(),
        bairro: editingAddress.bairro.trim(),
        cidade: editingAddress.cidade.trim(),
        estado: editingAddress.estado,
        cep: editingAddress.cep.replace(/\D/g, ""),
        complemento: editingAddress.complemento?.trim() || "",
        user_id: user.id,
      };

      console.log("Payload enviado:", payload);
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(
          editingAddress.id
            ? "Endereço atualizado com sucesso!"
            : "Endereço criado com sucesso!",
          "success"
        );
        setEditingAddress(null);
        setIsAddingNew(false);
        loadUserAddresses();
      } else {
        const data = await res.json();
        showToast(data.message || "Erro ao salvar o endereço.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Erro ao conectar com o servidor.", "error");
    } finally {
      setAddressLoading(false);
    }
  };

  const startEditing = (address: Address) => {
    setEditingAddress({ ...address });
    setIsAddingNew(false);
  };

  const startAddingNew = () => {
    setEditingAddress({
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      complemento: "",
    });
    setIsAddingNew(true);
  };

  const cancelEditing = () => {
    setEditingAddress(null);
    setIsAddingNew(false);
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;
    try {
      setAddressLoading(true);
      const res = await fetch(
        `http://localhost:3000/customer_address/${addressToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (res.ok) {
        showToast("Endereço excluído com sucesso!", "success");
        setAddressToDelete(null);
        loadUserAddresses();
      } else {
        const data = await res.json();
        showToast(data.message || "Erro ao excluir o endereço.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Erro ao conectar com o servidor.", "error");
    } finally {
      setAddressLoading(false);
    }
  };

  const primeiraLinha: FormField[] = [
    { field: "name", icon: <FaUser />, placeholder: "Nome completo" },
    { field: "email", icon: <FaEnvelope />, placeholder: "E-mail" },
  ];

  const segundaLinha: FormField[] = [
    { field: "cpf", icon: <FaIdCard />, placeholder: "CPF", readOnly: true },
    { field: "phone", icon: <FaIdCard />, placeholder: "Telefone" },
    {
      field: "birthDate",
      icon: <FaBirthdayCake />,
      placeholder: "Data de nascimento",
      type: "date",
      readOnly: true,
    },
  ];

  return (
    <div className="flex justify-center p-4 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-6xl space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Editar Cadastro
        </h1>
        <p className="text-gray-500 text-center mt-1">É rápido e fácil!</p>

        {/* Dados Pessoais */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Dados Pessoais
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Primeira linha: Nome e Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {primeiraLinha.map(
                ({ field, icon, placeholder, type, readOnly }) => (
                  <div key={field} className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {icon}
                    </div>
                    <input
                      type={type || "text"}
                      name={field}
                      value={form[field as keyof typeof form]}
                      onChange={handleChange}
                      readOnly={readOnly}
                      placeholder={placeholder}
                      className={`peer w-full pl-10 pr-3 pt-4 pb-2 rounded-md border border-gray-300 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        readOnly
                          ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                          : "bg-white text-gray-800"
                      }`}
                    />
                    <label className="absolute left-10 -top-0 text-gray-400 text-xs transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-0 peer-focus:text-green-600 peer-focus:text-xs pointer-events-none">
                      {placeholder}
                    </label>
                  </div>
                )
              )}
            </div>

            {/* Segunda linha: CPF, Telefone e Data de Nascimento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {segundaLinha.map(
                ({ field, icon, placeholder, type, readOnly }) => (
                  <div key={field} className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {icon}
                    </div>
                    <input
                      type={type || "text"}
                      name={field}
                      value={form[field as keyof typeof form]}
                      onChange={handleChange}
                      readOnly={readOnly}
                      placeholder={placeholder}
                      className={`peer w-full pl-10 pr-3 pt-4 pb-2 rounded-md border border-gray-300 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        readOnly
                          ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                          : "bg-white text-gray-800"
                      }`}
                    />
                    <label className="absolute left-10 -top-0 text-gray-400 text-xs transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-0 peer-focus:text-green-600 peer-focus:text-xs pointer-events-none">
                      {placeholder}
                    </label>
                  </div>
                )
              )}
            </div>

            {/* Senha e confirmação */}
            <div className="relative col-span-full md:flex md:gap-4">
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
              className="col-span-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Salvando..." : "Salvar Dados Pessoais"}
            </button>
          </form>
        </div>

        {/* Endereços */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Meus Endereços
            </h2>
          </div>

          {addressLoading ? (
            <p className="text-center py-8 text-gray-600">
              Carregando endereços...
            </p>
          ) : (
            <>
              {/* Lista de Endereços */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {addresses.map((address, index) => (
                  <div
                    key={address.id || index}
                    className={`relative p-4 rounded-lg border-2 ${
                      address.is_primary
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {/* Card indicativo endereço principal */}
                    <div className="flex justify-between items-start mb-3">
                      <div
                        className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
                          address.is_primary
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            address.is_primary ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        {address.is_primary ? "Principal" : ""}
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                          address.is_primary
                            ? "bg-green-600 border-green-600"
                            : "border-gray-400 bg-white hover:border-green-500"
                        }`}
                        onClick={() =>
                          !address.is_primary &&
                          address.id &&
                          handleSetPrimaryAddress(address.id)
                        }
                        title={
                          address.is_primary
                            ? "Endereço principal"
                            : "Definir como principal"
                        }
                      >
                        {address.is_primary && (
                          <FaCheck className="text-white text-xs" />
                        )}
                      </div>
                    </div>

                    {/* Endereço cadastrado */}
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Logradouro:</span>{" "}
                        {address.logradouro}, {address.numero}
                      </p>
                      {address.complemento && (
                        <p>
                          <span className="font-medium">Complemento:</span>{" "}
                          {address.complemento}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Bairro:</span>{" "}
                        {address.bairro}
                      </p>
                      <p>
                        <span className="font-medium">Cidade:</span>{" "}
                        {address.cidade} - {address.estado}
                      </p>
                      <p>
                        <span className="font-medium">CEP:</span> {address.cep}
                      </p>
                    </div>

                    {/* Confirmar exclusão */}
                    {addressToDelete === address.id ? (
                      <div className="mt-4 pt-3 border-t border-gray-200 justify-center">
                        <p className="text-sm text-gray-600 mb-3">
                          Confirmar exclusão?
                        </p>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => setAddressToDelete(null)}
                            className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleDeleteAddress}
                            disabled={addressLoading}
                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {addressLoading ? "Excluindo..." : "Excluir"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 justify-center">
                        <button
                          onClick={() => startEditing(address)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors cursor-pointer"
                        >
                          Editar endereço
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => setAddressToDelete(address.id!)}
                          disabled={address.is_primary}
                          className={`text-sm font-medium transition-colors ${
                            address.is_primary
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:text-red-800 cursor-pointer"
                          }`}
                          title={
                            address.is_primary
                              ? "Não é possível excluir o endereço principal"
                              : "Excluir endereço"
                          }
                        >
                          Excluir endereço
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Cards sem endereço */}
                {Array.from({ length: 3 - addresses.length }).map(
                  (_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 transition-colors min-h-[200px]"
                    >
                      <FaMapMarkerAlt className="text-2xl mb-2" />
                      <p className="text-center">Endereço disponível</p>
                      <button
                        onClick={startAddingNew}
                        className="mt-3 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
                      >
                        Adicionar
                      </button>
                    </div>
                  )
                )}
              </div>

              {/* Formulário de Endereço */}
              {(isAddingNew || editingAddress) && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {isAddingNew ? "Novo Endereço" : "Editando Endereço"}
                  </h3>
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
                      {
                        field: "complemento",
                        icon: <FaBuilding />,
                        placeholder: "Complemento",
                      },
                      {
                        field: "bairro",
                        icon: <FaCity />,
                        placeholder: "Bairro *",
                      },
                      {
                        field: "cidade",
                        icon: <FaCity />,
                        placeholder: "Cidade *",
                      },
                    ].map(({ field, icon, placeholder }) => (
                      <div key={field} className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {icon}
                        </div>
                        <input
                          type="text"
                          name={field}
                          value={
                            editingAddress?.[
                              field as Exclude<keyof Address, "is_primary">
                            ] || ""
                          }
                          onChange={handleAddressChange}
                          required={
                            !placeholder.includes("(opcional)") &&
                            !placeholder.endsWith("*")
                          }
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
                      value={editingAddress?.estado || ""}
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

                    <div className="col-span-full flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={addressLoading}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {addressLoading
                          ? "Salvando..."
                          : isAddingNew
                          ? "Adicionar Endereço"
                          : "Atualizar Endereço"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
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
