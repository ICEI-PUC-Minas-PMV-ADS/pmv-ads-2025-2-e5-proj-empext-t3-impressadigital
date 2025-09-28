// page.tsx
"use client";

import React, { useEffect, useState } from "react";

interface Client {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string;
}

const DashboardClients: React.FC = () => {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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
      const response = await fetch('http://localhost:3000/users');
      if (!response.ok) {
        throw new Error('Erro ao carregar clientes');
      }
      const users: any[] = await response.json();
      
      const clientUsers = users
        .filter(user => user.role === 'cliente')
        .map(user => ({
          id: user.id,
          name: user.name,
          cpf: user.cpf || 'Não informado',
          email: user.email,
          phone: user.phone || 'Não informado',
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
      console.error('Erro ao carregar clientes:', err);
      setClients([]);
      setFilteredClients([]);
    } finally {
      setLoading(false);
    }
  };

  const timeoutId = setTimeout(fetchClients, 500);
  return () => clearTimeout(timeoutId);
}, [search]);

  const handleRemove = async (id: number) => {
    if (confirm("Tem certeza que deseja remover este cliente?")) {
      try {
        const response = await fetch(`http://localhost:3000/users/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setClients(prev => prev.filter(client => client.id !== id));
          setFilteredClients(prev => prev.filter(client => client.id !== id));
        } else {
          throw new Error('Erro ao remover cliente');
        }
      } catch (err) {
        console.error('Erro ao remover cliente:', err);
        alert('Erro ao remover cliente');
      }
    }
  };

  return (
    <div className="text-black">
      <p className="text-black text-4xl font-bold mb-6">Clientes</p>

      {/* Input de pesquisa */}
      <input
        type="text"
        placeholder="Pesquise o cliente por nome, CPF ou e-mail"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
      />

      {!hasSearched && search.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
            <p className="text-gray-600 text-lg mb-4">
              🔍 Pesquise por clientes
            </p>
            <p className="text-gray-500 text-sm">
              Digite o nome, CPF ou e-mail do cliente na barra de pesquisa acima para visualizar os resultados.
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Carregando clientes...</p>
        </div>
      )}

      {/* Lista dos clientes */}
      <div className="flex flex-col gap-4">
        {hasSearched && !loading && filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 w-full">
                <div>
                  <p className="text-gray-400 text-sm mb-4">Nome</p>
                  <p className="font-semibold text-[#4B4B4B] text-sm truncate">
                    {client.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-4">CPF</p>
                  <p className="font-semibold text-[#4B4B4B] text-sm ">
                    {client.cpf}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-4">E-mail</p>
                  <p className="font-semibold text-[#4B4B4B] text-sm  truncate">
                    {client.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-4">Telefone</p>
                  <p className="font-semibold text-[#4B4B4B] text-sm ">
                    {client.phone}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRemove(client.id)}
                className="mt-4 md:mt-0 px-4 py-1 bg-[#45A62D] text-white rounded-full transition text-sm cursor-pointer"
              >
                Remover
              </button>
            </div>
          ))
        ) : hasSearched && !loading && search.length > 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhum cliente encontrado para "{search}".</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DashboardClients;