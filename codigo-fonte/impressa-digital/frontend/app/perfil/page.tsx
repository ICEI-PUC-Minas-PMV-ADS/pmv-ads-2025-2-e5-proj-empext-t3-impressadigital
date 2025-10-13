'use client'
import React, { useState } from 'react';
// Importar o useAuth (Assumindo que está em um caminho acessível)
import { useAuth } from '../contexts/Authprovider'; // AJUSTE O CAMINHO CONFORME A ESTRUTURA REAL DO SEU PROJETO

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



const Perfil: React.FC = () => {
  // Obter a função de logout
  const { logout, user } = useAuth(); 
  
  // Estado para controlar qual página está ativa
  const [paginaAtiva, setPaginaAtiva] = useState('pedidos');
  // Estado para controlar a visibilidade do modal de confirmação
  const [showLogoutModal, setShowLogoutModal] = useState(false);

    const usernameDisplay = user ? user.name.split(" ")[0] : "Visitante"; 

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
  
  // Handler para confirmar e executar o logout
  const handleLogout = () => {
      logout();
      setShowLogoutModal(false);
      // Opcional: Redirecionar para a home ou login (o próprio `logout` pode fazer isso)
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
          {/* Nota: No ambiente real, você provavelmente usaria user.name ou user.email aqui */}
          <p className="text-center text-white font-semibold">Olá, @{usernameDisplay}</p>
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

      <div className="flex flex-col text-center">
        <button className="bg-white text-black rounded-full px-8 py-1 mb-4 hover:bg-gray-200 transition">
          Voltar
        </button>
        <button 
            className="text-white hover:text-red-500 transition font-bold"
            onClick={() => setShowLogoutModal(true)} // Abre o modal
        >
            SAIR
        </button>
      </div>
      </aside>

      {/* Conteúdo da página */}
      <main style={{ flex: 1, backgroundColor: '#fff', padding: '65px', overflowY: 'auto' }}>
        {renderizarConteudo()}
      </main>
      
      {/* Modal de Confirmação de Logout */}
      {showLogoutModal && (
        <div className="fixed top-130 left-75 inset-0  bg-opacity-50 flex items-center  z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmação de Saída</h3>
            <p className="text-gray-600 mb-6">Tem certeza que deseja sair da sua conta?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-[#1a9d20] text-white rounded-lg hover:bg-[#14a800] transition"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;