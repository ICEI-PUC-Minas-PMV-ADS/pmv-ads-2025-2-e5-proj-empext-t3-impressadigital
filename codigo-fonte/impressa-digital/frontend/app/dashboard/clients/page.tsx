"use client";

import React, { useEffect, useState } from "react";

interface Address {
  id?: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface Client {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  endereco?: Address; // único endereço
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

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
}) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder || "Pesquisar..."}
    className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
  />
);

const DashboardClients: React.FC = () => {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    const fetchClients = async () => {
      if (search.length === 0) {
        setFilteredClients([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) throw new Error("Erro ao carregar clientes");
        const users: any[] = await response.json();

        // filtra apenas clientes
        const clientUsers: Client[] = users
          .filter((user) => user.role === "cliente")
          .map((user) => ({
            id: user.id,
            name: user.name,
            cpf: user.cpf || "Não informado",
            email: user.email,
            phone: user.phone || "Não informado",
            endereco: user.endereco || undefined, // único endereço
          }));

        const results = clientUsers.filter(
          (client) =>
            client.name.toLowerCase().includes(search.toLowerCase()) ||
            client.cpf.includes(search) ||
            client.email.toLowerCase().includes(search.toLowerCase())
        );

        setClients(clientUsers);
        setFilteredClients(results);
      } catch (err) {
        console.error(err);
        showToast(
          err instanceof Error ? err.message : "Erro desconhecido",
          "error"
        );
        setClients([]);
        setFilteredClients([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchClients, 500);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleRemove = (client: Client) => {
    setDeletingClient(client);
  };

  const confirmDelete = async () => {
    if (!deletingClient) return;
    try {
      const response = await fetch(
        `http://localhost:3000/users/${deletingClient.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Erro ao remover cliente");

      setClients((prev) => prev.filter((c) => c.id !== deletingClient.id));
      setFilteredClients((prev) =>
        prev.filter((c) => c.id !== deletingClient.id)
      );
      showToast("Cliente removido com sucesso!", "success");
      setDeletingClient(null);
    } catch (err) {
      console.error(err);
      showToast("Erro ao remover cliente", "error");
    }
  };

  return (
    <div className="w-full bg-white p-6 text-black">
      <p className="text-xl lg:text-2xl font-bold mb-6">Clientes</p>

      {/* Pesquisa */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Pesquisar por nome, CPF ou e-mail"
      />

      {!hasSearched && search.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
            <p className="text-gray-600 text-lg mb-4">
              🔍 Pesquise por clientes
            </p>
            <p className="text-gray-500 text-sm">
              Digite o nome, CPF ou e-mail do cliente na barra de pesquisa acima
              para visualizar os resultados.
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Carregando clientes...</p>
        </div>
      )}

      {/* Lista de clientes */}
      <div className="flex flex-col gap-4">
        {hasSearched && !loading && filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-2 w-full">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Nome</p>
                  <p className="font-semibold text-[#4B4B4B] text-sm truncate">
                    {client.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">CPF</p>
                  <p className="font-semibold text-[#4B4B4B] text-sm">
                    {client.cpf}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">E-mail</p>
                  <p className="font-semibold text-[#4B4B4B] text-sm truncate">
                    {client.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Telefone</p>
                  <p className="font-semibold text-[#4B4B4B] text-sm">
                    {client.phone}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Endereço</p>
                  <p className="font-semibold text-[#4B4B4B] text-sm">
                    {client.endereco
                      ? `${client.endereco.logradouro}, ${client.endereco.numero} - ${client.endereco.bairro}, ${client.endereco.cidade}/${client.endereco.estado}`
                      : "Não informado"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRemove(client)}
                className="mt-4 md:mt-0 px-4 py-1 bg-[#45A62D] text-white rounded-full transition text-sm cursor-pointer"
              >
                Remover
              </button>
            </div>
          ))
        ) : hasSearched && !loading && search.length > 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Nenhum cliente encontrado para "{search}".
            </p>
          </div>
        ) : null}
      </div>

      {/* Modal de exclusão */}
      {deletingClient && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Confirmar Exclusão</h2>
            <p>
              Tem certeza que deseja remover o cliente{" "}
              <span className="font-semibold">{deletingClient.name}</span>?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeletingClient(null)}
                className="px-4 py-2 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 cursor-pointer"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

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

export default DashboardClients;
