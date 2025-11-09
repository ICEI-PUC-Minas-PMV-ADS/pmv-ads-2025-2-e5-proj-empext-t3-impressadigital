'use client';
import React, { useEffect, useState } from 'react';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';

interface Client {
  id: number;
  name: string;
  email: string;
}

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  setTimeout(onClose, 3000);
  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 text-white ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      {message}
    </div>
  );
};

export default function DashboardPasswordSupport() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempEmail, setTempEmail] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
        const data = await res.json();
        const usersArray = Array.isArray(data) ? data : data.users;
        if (!Array.isArray(usersArray)) throw new Error('Resposta da API inválida');
        setClients(usersArray.filter((u: any) => u.role === 'cliente'));
      } catch (err) {
        console.error(err);
        showToast('Erro ao carregar usuários', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredClients([]);
      return;
    }
    setFilteredClients(
      clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, clients]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendLink = async (client: Client) => {
    setSendingId(client.id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/password-reset/send-to-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: client.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao enviar link');
      showToast(`Link enviado para ${client.email}`);
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Erro desconhecido', 'error');
    } finally {
      setSendingId(null);
    }
  };

  const handleUpdateEmail = async (client: Client) => {
    if (!validateEmail(tempEmail)) {
      showToast('Email inválido', 'error');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: tempEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao atualizar email');

      setClients((prev) =>
        prev.map((c) => (c.id === client.id ? { ...c, email: tempEmail } : c))
      );
      setFilteredClients((prev) =>
        prev.map((c) => (c.id === client.id ? { ...c, email: tempEmail } : c))
      );
      showToast('Email atualizado com sucesso!');
      setEditingId(null);
      setTempEmail('');
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Erro desconhecido', 'error');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, client: Client) => {
    if (e.key === 'Enter') handleUpdateEmail(client);
  };

  const displayedClients = filteredClients.length > 0 ? filteredClients : [];

  return (
    <div className="w-full bg-white p-6 text-black">
      <h1 className="text-2xl font-bold mb-6">Suporte ao Usuário</h1>

      <input
        type="text"
        placeholder="Pesquisar usuário por nome ou email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-green-500"
      />

      {loading ? (
        <p className="text-gray-600">Carregando usuários...</p>
      ) : displayedClients.length === 0 ? (
        <div className="text-center text-gray-400 p-10 border border-dashed border-gray-300 rounded-xl">
          <p className="text-2xl mb-2">🔍 Pesquise por clientes</p>
          <p>Digite o nome ou e-mail do cliente na barra de pesquisa acima para visualizar os resultados.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displayedClients.map((client) => (
            <div
              key={client.id}
              className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:gap-6 w-full">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Nome</p>
                  <p className="font-semibold text-[#4B4B4B] text-sm truncate">{client.name}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={editingId === client.id ? tempEmail : client.email}
                      disabled={editingId !== client.id}
                      onChange={(e) => setTempEmail(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, client)}
                      className={`border px-2 py-1 rounded-lg text-sm w-full md:w-60 ${
                        editingId === client.id
                          ? 'border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                          : 'border-gray-300 bg-gray-100'
                      }`}
                    />

                    {editingId === client.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateEmail(client)}
                          className="text-green-600 hover:text-green-800 transition-colors cursor-pointer"
                        >
                          <FiCheck size={20} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setTempEmail('');
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <FiX size={20} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(client.id);
                          setTempEmail(client.email);
                        }}
                        className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                      >
                        <FiEdit2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSendLink(client)}
                disabled={sendingId === client.id}
                className="mt-2 md:mt-0 px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors text-sm whitespace-nowrap cursor-pointer"
              >
                {sendingId === client.id ? 'Enviando...' : 'Enviar link de redefinição de senha'}
              </button>
            </div>
          ))}
        </div>
      )}

      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
