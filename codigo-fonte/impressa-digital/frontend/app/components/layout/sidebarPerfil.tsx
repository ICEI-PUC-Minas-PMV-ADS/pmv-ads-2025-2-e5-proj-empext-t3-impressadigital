"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "@/app/contexts/sidebarContext";
import { useAuth } from "@/app/contexts/Authprovider";
import Link from "next/link";
import { useState } from "react";
import { color } from "framer-motion";
import { text } from "stream/consumers";

const menuItems = [
  { label: "Perfil", path: "/perfil/"},
  { label: "Carrinho", path: "/perfil/carrinho" },
  { label: "Pedidos", path: "/perfil/pedidos" },
];

const SidebarPerfil: React.FC = () => {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  // Estado para controlar a visibilidade do modal de confirmação
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const usernameDisplay = user?.name?.split(" ")[0] || "Visitante";

  // Handler para confirmar e executar o logout
  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    // Opcional: Redirecionar para a home ou login (o próprio `logout` pode fazer isso)
  };

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
        fixed md:static top-0 left-0 h-screen md:h-screen md:w-64 lg:w-[15%] bg-white text-[#000000] p-4 flex flex-col justify-between font-bold font-sans items-start text-xl
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

          <nav className="flex align-center flex-col gap-6 mb-100 md:mt-0 md:mb-0 w-full ">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`p-2 hover:text-[#45A62D] ${
                  pathname === item.path ? "text-[#45A62D] font-semibold" : "text-gray-700"
                }`}
                onClick={closeSidebar}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        
      </aside>
    </>
  );
};

export default SidebarPerfil;