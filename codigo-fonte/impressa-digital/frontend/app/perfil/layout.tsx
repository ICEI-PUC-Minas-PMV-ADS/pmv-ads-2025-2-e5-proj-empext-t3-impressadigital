"use client";

import type { ReactNode } from "react";
import SidebarPerfil from "../components/layout/sidebarPerfil";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "../contexts/sidebarContext";
import { useAuth } from "../contexts/Authprovider";
import { useState } from "react";
import { ProtectedRoute } from "../components/layout/protectedRoute";

export default function LayoutPerfil({ children }: { children: ReactNode }) {
    const { toggleSidebar } = useSidebar();
    const { logout, user } = useAuth();
    
    // Estados para controlar o dropdown e o modal
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    const usernameDisplay = user?.name?.split(" ")[0] || "Visitante";

    // Handlers
    const handleLogout = () => {
        logout();
        setShowLogoutModal(false);
    };

    const openLogoutModal = () => {
        setShowUserDropdown(false); // Fecha o dropdown primeiro
        setShowLogoutModal(true); // Abre o modal
    };
    
    const toggleDropdown = () => {
        setShowUserDropdown(prev => !prev);
    };

    return (
        <ProtectedRoute>
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header: Usa `relative` e `z-10` para garantir que o dropdown funcione */}
            <header className={`p-4 flex justify-between items-center px-4 md:px-10 bg-white relative z-10`}> 
                
                {/* Toggle mobile: Posicionamento absoluto */}
                <button
                    className="md:hidden mr-4 text-2xl text-[#45A62D] absolute left-4 top-1/2 transform -translate-y-1/2"
                    onClick={toggleSidebar}
                >
                    ☰
                </button>

                {/* Container do Logo: Centralizado */}
                <div className="flex-1 flex justify-center items-center">
                    <Link href="/" className="self-center">
                        <Image
                            src="/images/logo_impressa_digital.png"
                            alt="Logo"
                            width={150}
                            height={104}
                            className="self-center"
                        />
                    </Link>
                </div>
                
                {/* Ícone de perfil e nome com Dropdown (Posicionamento relativo) */}
                <div className=" self-start relative z-20"> 
                    <div 
                        className="flex flex-col items-center "
                        onClick={toggleDropdown}
                    >
                        {/* Ícone */}
                        <div className="bg-white rounded-full w-10 h-10 md:w-16 md:h-16 flex items-center justify-center mb-0 md:mb-2 shadow-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 md:h-8 md:w-8 text-black"
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
                        {/* Nome do Usuário */}
                        <p className="hidden md:flex items-center text-center text-black font-semibold text-sm cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition" >
                            Olá, @{usernameDisplay}
                            <svg 
                                className={`ml-2 h-4 w-4 transform transition-transform ${showUserDropdown ? 'rotate-180' : 'rotate-0'}`} 
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </p>
                    </div>

                    {/* Dropdown de SAIR */}
                    {showUserDropdown && (
                        <div className="absolute right-0 w-40 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 overflow-hidden">
                            <button
                                className="w-full text-center px-4 py-2 text-base text-[#45A62D] hover:bg-gray-100 hover:text-[#45A62D] transition font-normal"
                                onClick={openLogoutModal}
                            >
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </header>
            
            <div className="flex flex-1">
                <SidebarPerfil />
                <main className="flex-1 max-w-7xl p-6 font-sans mt-8 overflow-y-auto">
                    {children}
                </main>
            </div>
            
            {/* Modal de Confirmação de Logout (Overlay de tela cheia) */}
            {showLogoutModal && (
                <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]"
                    onClick={() => setShowLogoutModal(false)} 
                >
                    <div 
                        className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100"
                        onClick={(e) => e.stopPropagation()} 
                    >
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
        </ProtectedRoute>
    );
}