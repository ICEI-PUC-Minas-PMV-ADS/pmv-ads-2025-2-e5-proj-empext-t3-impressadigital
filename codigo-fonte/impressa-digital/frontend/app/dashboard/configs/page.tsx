"use client";

import { useState, useEffect } from "react";

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

const Toast: React.FC<ToastProps> = ({ message, type = "success", onClose }) => {
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

const Modal: React.FC<ModalProps> = ({ title, message, onConfirm, onCancel }) => (
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

export default function DashboardConfigs() {
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    cpf: "",
    email: "",
    password: "",
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

  const showToast = (message: string, type: "success" | "error" = "success") => {
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
      const response = await fetch(url);
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
      newValue = value.replace(/\D/g, "").slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      setCpfError(newValue.length < 14 ? "Preencha o CPF completo (11 dígitos)." : "");
    }
    if (name === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 11)
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

    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "admin" }),
      });
      if (res.ok) {
        showToast("Administrador criado com sucesso!", "success");
        setForm({ name: "", birthDate: "", cpf: "", email: "", password: "", phone: "", role: "admin" });
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
      const res = await fetch(`http://localhost:3000/users/${modalAdmin.id}`, { method: "DELETE" });
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
      const res = await fetch(`http://localhost:3000/users/${admin.id}/restore`, { method: "PATCH" });
      if (!res.ok) throw new Error("Erro ao restaurar administrador");
      showToast("Administrador restaurado com sucesso!", "success");
      fetchAdmins();
    } catch {
      showToast("Erro ao restaurar administrador", "error");
    }
  };

  return (
    <>
      <style>{modalAnimationStyle}</style>
      <div className="w-full bg-white p-6 text-black">
        <h1 className="text-2xl font-bold mb-6">Configurações do Sistema</h1>

        {/* Formulário de criação */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">Criar Novo Administrador</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CPF</label>
              <input
                type="text"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                required
                maxLength={14}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="000.000.000-00"
              />
              {cpfError && <div className="text-red-500 text-xs mt-1">{cpfError}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Criando..." : "Criar Administrador"}
              </button>
            </div>
          </form>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setViewingDeleted(false)}
            className={`px-4 py-2 rounded-full transition text-sm ${
              !viewingDeleted ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Ativos
          </button>
          <button
            onClick={() => setViewingDeleted(true)}
            className={`px-4 py-2 rounded-full transition text-sm ${
              viewingDeleted ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
          <div className="text-center py-8 text-gray-500">Nenhum administrador encontrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Nome</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">E-mail</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">CPF</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Telefone</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">{admin.name}</td>
                    <td className="border border-gray-300 px-4 py-3">{admin.email}</td>
                    <td className="border border-gray-300 px-4 py-3">{admin.cpf}</td>
                    <td className="border border-gray-300 px-4 py-3">{admin.phone || "Não informado"}</td>
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
          <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
        )}
      </div>
    </>
  );
}
