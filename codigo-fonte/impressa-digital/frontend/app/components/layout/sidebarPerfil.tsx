'use client';
import React, { useState } from "react";

// Importar os componentes das páginas filhas
import Carrinho from "@/app/perfil/carrinho/page";
import PedidosPage from "@/app/perfil/pedidos/page";
import EditarPerfil from "@/app/perfil/editarPerfil/page";

interface SidebarProps {
  username: string;
}

const Sidebar: React.FC<SidebarProps> = ({ username }) => {
    const [paginaAtiva, setPaginaAtiva] = useState("pedidos");

    const renderizarConteudo = () => {
        switch (paginaAtiva) {
          case "carrinho":
            return <Carrinho />;
          case "pedidos":
            return <PedidosPage />;
          case "editarPerfil":
            return <EditarPerfil />;
          default:
            return <PedidosPage />;
        }
      };

    return (
      <div>
    <aside className="bg-black text-white w-48 min-h-screen flex flex-col justify-between p-6">
      <div>
        <div className="flex flex-col items-center mb-8">
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

        <nav className="flex flex-col gap-2 text-lg">
                  <button className="text-left px-3 py-2 hover:bg-white hover:text-black rounded transition"
                  onClick={() => setPaginaAtiva("carrinho")}
                  >
            Carrinho &gt;
          </button>
                  <button className="text-left px-3 py-2 hover:bg-white hover:text-black rounded transition"
                  onClick={() => setPaginaAtiva("pedidos")}
                  >
            Pedidos &gt;
          </button>
                        <button className="text-left px-3 py-2 hover:bg-white
                   hover:text-black rounded transition "
                      onClick={() => setPaginaAtiva("editarPerfil")}
                      
                  >
            Editar perfil &gt;
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
      <main style={{ flex: 1, backgroundColor: '#fff', padding: '30px', overflowY: 'auto' }}>
        {renderizarConteudo()}
      </main>
            
    </div>
  );
};

export default Sidebar;