"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../../contexts/sidebarContext";

const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Produtos", path: "/dashboardProducts" },
  { label: "Categorias", path: "/dashboardCategory" },
  { label: "Clientes", path: "/dashboardClients" },
  { label: "Configurações", path: "/configuracoes" },
];

export default function Sidebar() {
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
    fixed md:static top-0 left-0 min-h-screen lg:w-[15%] bg-white text-[#000000] p-4 flex flex-col font-bold font-sans items-start text-xl
    z-50 transition-transform duration-300 ease-in-out box-border
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
      >
        <button
          className="md:hidden self-end text-2xl mb-4 text-[#45A62D] hover:text-gray-700"
          onClick={closeSidebar}
        >
          ✕
        </button>
        <nav className="flex flex-col gap-6 mt-8 md:mt-20 w-full">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`p-2 rounded transform transition-all duration-200 hover:scale-105 lg:ml-2 ${
                pathname === item.path ? "text-[#45A62D] font-semibold" : ""
              }`}
              onClick={closeSidebar}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
