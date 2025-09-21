"use client";

import React, { useEffect, useState } from "react";

interface Client {
  id: number;
  name: string;
  cpf: string;
  email: string;
  endereco: string;
}

const mockClients: Client[] = [
  {
    id: 1,
    name: "Ana Castro de Souza",
    cpf: "000.000.000-00",
    email: "anacastro123@gmail.com",
    endereco: "Rua 1, casa 2",
  },
  {
    id: 2,
    name: "João Pereira",
    cpf: "111.222.333-44",
    email: "joaopereira@gmail.com",
    endereco: "Rua 1, casa 2",
  },
  {
    id: 3,
    name: "Maria Silva",
    cpf: "222.333.444-55",
    email: "mariasilva@gmail.com",
    endereco: "Rua 1, casa 2",
  },
];

const DashboardClients: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  useEffect(() => {
    if (search.length === 0) {
      setFilteredClients([]);
      return;
    }

    const results = mockClients.filter(
      (client) =>
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.cpf.includes(search) ||
        client.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredClients(results);
  }, [search]);

  const handleRemove = (id: number) => {
    if (confirm("Tem certeza que deseja remover este cliente?")) {
      setFilteredClients((prev) => prev.filter((client) => client.id !== id));
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

      {/* Lista dos clientes */}
      <div className="flex flex-col gap-4">
        {filteredClients.length > 0 ? (
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
                  <p className="text-gray-400 text-sm mb-4">Endereço</p>
                  <p className="font-semibold text-[#4B4B4B] text-sm  truncate">
                    {client.endereco}
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
        ) : search.length > 0 ? (
          <p className="text-gray-600">Nenhum cliente encontrado.</p>
        ) : null}
      </div>
    </div>
  );
};

export default DashboardClients;
