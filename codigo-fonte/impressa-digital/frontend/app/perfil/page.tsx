'use client'
import React, { useState } from 'react';

// Importar os componentes das páginas filhas
import Carrinho from './carrinho/page';
import PedidosPage from './pedidos/page';
import EditarPerfil from './editarPerfil/page';

const menuItems = [
  { label: "Perfil", path: "/perfil/" },
  { label: "Carrinho", path: "/perfil/carrinho" },
  { label: "Pedidos", path: "/perfil/pedidos" },
  { label: "EditarPerfil", path: "/perfil/editar-perfil" },

];

interface SidebarProps {
  username: string;
}

const Perfil: React.FC<SidebarProps> = ({ username }) => {
  // Estado para controlas qual página está ativa
  const [paginaAtiva, setPaginaAtiva] = useState('pedidos');

  const renderizarConteudo = () => {
    switch (paginaAtiva) {
      case 'carrinho':
        return <Carrinho />;
      case 'pedidos':
        return <PedidosPage />;
      case 'editarPerfil':
        return <EditarPerfil />;
      default:
        return <PedidosPage />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <aside className="bg-[#222421] text-white w-75 min-h-screen flex flex-col justify-between p-6">
      <div className="flex flex-col gap-15 items-center mt-8">
        <div className="flex flex-col items-center gap-5 mb-8">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A13.937 13.937 0 012 12c0-3.866 1.567-7.365 4.121-9.804a1 1 0 011.757 1.11 9.972 9.972 0 00-1.244 3.955 10 10 0 0010 10c1.524 0 2.971-.43 4.2-1.168a1 1 0 011.159 1.646 13.96 13.96 0 01-10.874 4.261z"
              />
            </svg>
          </div>
          <p className="text-center text-white font-semibold">Olá, @{username}</p>
        </div>

        <nav className="flex flex-col gap-1 text-lg w-full">
          <button
            className={`w-full flex justify-between items-center px-4 py-3 bg-[#1C1C1C] rounded transition
              ${paginaAtiva === "carrinho" ? "bg-white text-black" : "text-white"}`}
            onClick={() => setPaginaAtiva("carrinho")}
          >
            <span className="flex-1 text-center">Carrinho</span>
            <span>&gt;</span>
          </button>

          <button
            className={`w-full flex justify-between items-center px-4 py-3 bg-[#1C1C1C] rounded transition
              ${paginaAtiva === "pedidos" ? "bg-white text-black" : "text-white"}`}
            onClick={() => setPaginaAtiva("pedidos")}
          >
            <span className="flex-1 text-center">Pedidos</span>
            <span>&gt;</span>
          </button>

          <button
            className={`w-full flex justify-between items-center px-4 py-3 bg-[#1C1C1C] rounded transition
              ${paginaAtiva === "editarPerfil" ? "bg-white text-black" : "text-white"}`}
            onClick={() => setPaginaAtiva("editarPerfil")}
          >
            <span className="flex-1 text-center">Editar perfil</span>
            <span>&gt;</span>
          </button>
        </nav>
      </div>

      <div className="text-center">
        <button className="bg-white text-black rounded-full px-8 py-1 mb-4 hover:bg-gray-200 transition">
          Voltar
        </button>
        <p className="text-white">SAIR</p>
      </div>
      </aside>

      {/* Conteúdo da página */}
      <main style={{ flex: 1, backgroundColor: '#fff', padding: '65px', overflowY: 'auto' }}>
        {renderizarConteudo()}
      </main>
    </div>
  );
};

export default Perfil;