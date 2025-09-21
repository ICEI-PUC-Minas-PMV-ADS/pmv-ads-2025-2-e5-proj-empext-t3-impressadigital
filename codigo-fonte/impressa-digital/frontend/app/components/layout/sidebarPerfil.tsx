'use client';


// Importar os componentes das páginas filhas

import { usePathname } from "next/navigation";
import { useSidebar } from "@/app/contexts/sidebarContext";
import Link from "next/link";

interface SidebarProps {
  username: string;
}

const menuItems = [
  { label: "Carrinho", path: "/perfil/carrinho" },
  { label: "Pedidos", path: "/perfil/pedidos" },
  { label: "Editar Perfil", path: "/perfil/editarPerfil" },
 
];

const Sidebar: React.FC<SidebarProps> = ({ username }) => {
    const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  return (
      <>
        {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}
        <aside
        className={`
    fixed md:static top-0 left-0 min-h-screen h-[100vh] lg:w-[15%] bg-white text-[#000000] p-4 flex flex-col justify-between font-bold font-sans items-start text-xl
    z-50 transition-transform duration-300 ease-in-out box-border shadow-md
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
      >
        <button
          className="md:hidden self-end text-2xl mb-4 text-[#45A62D] hover:text-gray-700"
          onClick={closeSidebar}
        >
          ✕
        </button>
      <div>
        <div className="flex flex-col items-center mb-28">
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
          <p className="text-center text-black font-semibold">Olá, @{username}</p>
            </div>

        <nav className="flex flex-col gap-6 mt-8 mb-28 md:mt-20 w-full ">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`p-2 rounded transform transition-all duration-200 hover:scale-105 lg:ml-2 ${pathname === item.path ? "text-[#45A62D] font-semibold" : ""
                }`}
              onClick={closeSidebar}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="text-center mb-5">
        <button className="bg-white text-black rounded-full px-8 py-1 mb-4 hover:bg-gray-200 transition">
          Voltar
        </button>
        <p className="text-black">SAIR</p>
      </div>
      </aside>
   
            
    </>
  );
};

export default Sidebar;