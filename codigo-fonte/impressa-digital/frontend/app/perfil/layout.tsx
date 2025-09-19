"use client";

import type { ReactNode } from "react";
import SidebarPerfil from "../components/layout/sidebarPerfil";
import { useSidebar, } from "../contexts/sidebarContext";
export default function DashboardLayout({ children }: { children: ReactNode }) {
      const { toggleSidebar, isSidebarOpen } = useSidebar();
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Botão hamburguer só no mobile */}
      <div className="p-4 md:hidden fixed flex justify-between items-center ">
        <button
          onClick={toggleSidebar}
          className="text-2xl text-[#45A62D] hover:text-gray-700"
        >
          ☰
        </button>
       
      </div>
            
            <div className="flex flex-1">
                <SidebarPerfil username={"Douglas"} />
                <main className="flex-1 max-w-7xl p-6 font-sans mt-8">{children}</main>
            </div>
        </div>
    );
}
