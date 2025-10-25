"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "../../components/layout/protectedRoute";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import {
  FaUser,
  FaBirthdayCake,
  FaIdCard,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import { JSX } from "react";

interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;
  cpf: string;
  birthDate: string;
  phone?: string;
  deletedAt?: string;
}

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

interface ModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div
      className="absolute inset-0 backdrop-blur-sm bg-black/20 transition-opacity duration-300"
      onClick={onCancel}
    />
    <div className="bg-white rounded-lg p-6 w-96 relative z-10 shadow-lg transform transition-transform duration-300 scale-95 animate-modalShow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          {title.includes("Restaurar") ? "Restaurar" : "Desativar"}
        </button>
      </div>
    </div>
  </div>
);

const modalAnimationStyle = `
@keyframes modalShow {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-modalShow { animation: modalShow 0.2s ease-out forwards; }
`;

interface FormField {
  field: string;
  icon: JSX.Element;
  placeholder: string;
  type?: string;
  readOnly?: boolean;
}

export default function DashboardConfigs() {
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    cpf: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [cpfError, setCpfError] = useState("");
  const [admins, setAdmins] = useState<User[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [modalAdmin, setModalAdmin] = useState<User | null>(null);
  const [viewingDeleted, setViewingDeleted] = useState(false);

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

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    fetchAdmins();
  }, [viewingDeleted]);

  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const url = viewingDeleted
        ? "http://localhost:3000/users/deleted/all"
        : "http://localhost:3000/users";
      const response = await fetch(url, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Erro ao carregar administradores");
      const usersData: User[] = await response.json();
      const filteredAdmins = usersData.filter((user) => user.role === "admin");
      setAdmins(filteredAdmins);
    } catch (err) {
      showToast("Erro ao carregar administradores", "error");
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "cpf") {
      newValue = value
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      setCpfError(
        newValue.length < 14 ? "Preencha o CPF completo (11 dígitos)." : ""
      );
    }
    if (name === "phone") {
      newValue = value
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3");
    }
    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (form.cpf.replace(/\D/g, "").length !== 11) {
      setCpfError("Preencha o CPF completo (11 dígitos).");
      setLoading(false);
      return;
    }

    // Validar senha
    if (form.password && form.password !== form.confirmPassword) {
      showToast("As senhas não coincidem.", "error");
      setLoading(false);
      return;
    }

    if (
      form.password &&
      !passwordRules.every((rule) => rule.test(form.password))
    ) {
      showToast(
        "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.",
        "error"
      );
      setLoading(false);
      return;
    }

    try {
      // Criar payload sem o confirmPassword
      const { confirmPassword, ...payload } = form;
      
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast("Administrador criado com sucesso!", "success");
        setForm({
          name: "",
          birthDate: "",
          cpf: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          role: "admin",
        });
        fetchAdmins();
      } else {
        const error = await res.json();
        showToast(error.message || "Erro ao criar administrador.", "error");
      }
    } catch {
      showToast("Erro de conexão com o servidor.", "error");
    }
    setLoading(false);
  };

  const handleDeactivate = (admin: User) => setModalAdmin(admin);
  const confirmDeactivate = async () => {
    if (!modalAdmin || !modalAdmin.id) return;
    try {
      const res = await fetch(`http://localhost:3000/users/${modalAdmin.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao desativar administrador");
      showToast("Administrador desativado com sucesso!", "success");
      fetchAdmins();
    } catch {
      showToast("Erro ao desativar administrador", "error");
    } finally {
      setModalAdmin(null);
    }
  };

  const handleRestore = async (admin: User) => {
    if (!admin.id) return;
    try {
      const res = await fetch(
        `http://localhost:3000/users/${admin.id}/restore`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Erro ao restaurar administrador");
      showToast("Administrador restaurado com sucesso!", "success");
      fetchAdmins();
    } catch {
      showToast("Erro ao restaurar administrador", "error");
    }
  };

  const primeiraLinha: FormField[] = [
    { field: "name", icon: <FaUser />, placeholder: "Nome completo" },
    { field: "email", icon: <FaEnvelope />, placeholder: "E-mail" },
  ];

  const segundaLinha: FormField[] = [
    { field: "cpf", icon: <FaIdCard />, placeholder: "CPF" },
    { field: "phone", icon: <FaIdCard />, placeholder: "Telefone" },
    {
      field: "birthDate",
      icon: <FaBirthdayCake />,
      placeholder: "Data de nascimento",
      type: "date",
    },
  ];

  return (
    <ProtectedRoute roles={["owner"]}>
      <>
        <style>{modalAnimationStyle}</style>
        <div className="flex justify-center p-4 bg-gray-50 min-h-screen">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-6xl space-y-6">
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Configurações do Sistema
            </h1>

            {/* Formulário de criação */}
            <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Criar Novo Administrador
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
                          required
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
                          required={field !== "phone"}
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
                      required
                      className="peer w-full pl-10 pr-3 pt-4 pb-2 h-12 rounded-md border border-gray-300 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                    />
                    <label className="absolute left-10 top-4 text-gray-400 text-xs transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-0 peer-focus:text-green-600 peer-focus:text-xs pointer-events-none">
                      Senha
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
                      required
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
                  {loading ? "Criando..." : "Criar Administrador"}
                </button>
              </form>
            </div>

            {/* Filtros */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setViewingDeleted(false)}
                className={`px-4 py-2 rounded-full transition text-sm ${
                  !viewingDeleted
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Ativos
              </button>
              <button
                onClick={() => setViewingDeleted(true)}
                className={`px-4 py-2 rounded-full transition text-sm ${
                  viewingDeleted
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Desativados
              </button>
            </div>

            {/* Lista de administradores */}
            {loadingAdmins ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Carregando administradores...</p>
              </div>
            ) : admins.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum administrador encontrado
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        Nome
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        E-mail
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        CPF
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        Telefone
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">
                          {admin.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          {admin.email}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          {admin.cpf}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          {admin.phone || "Não informado"}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          {viewingDeleted ? (
                            <button
                              onClick={() => handleRestore(admin)}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm transition-colors"
                            >
                              Restaurar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeactivate(admin)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition-colors"
                            >
                              Desativar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Modal */}
            {modalAdmin && (
              <Modal
                title="Confirmar Desativação"
                message={`Tem certeza que deseja desativar o administrador "${modalAdmin.name}"?`}
                onConfirm={confirmDeactivate}
                onCancel={() => setModalAdmin(null)}
              />
            )}

            {/* Toast */}
            {toastMessage && (
              <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage(null)}
              />
            )}
          </div>
        </div>
      </>
    </ProtectedRoute>
  );
}