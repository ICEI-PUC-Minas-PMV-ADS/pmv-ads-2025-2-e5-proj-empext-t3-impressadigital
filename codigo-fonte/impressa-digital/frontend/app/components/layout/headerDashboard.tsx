"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSidebar } from "../../contexts/sidebarContext";

export default function HeaderDashboard() {
  const { toggleSidebar, isSidebarOpen } = useSidebar();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`w-full flex items-center justify-between p-6 border-b-2 border-[#D9D9D9] z-50 relative transition-all duration-300 text-black font-sans
        ${isSidebarOpen ? "backdrop-blur-md bg-white/70" : "bg-white"}
      `}
    >
      <div className="flex items-center">
        {/* Toggle mobile */}
        <button
          className="md:hidden mr-4 text-2xl text-[#45A62D]"
          onClick={toggleSidebar}
        >
          ☰
        </button>

        <Link href="/">
          <Image
            src="/images/logo_impressa_digital.png"
            alt="Logo"
            width={150}
            height={104}
          />
        </Link>
      </div>

      <nav className="relative" ref={menuRef}>
        <ul className="flex gap-4 items-center relative">
          {/* Ícone do perfil */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="focus:outline-none"
            >
              <Image
                src="/images/person_icon.png"
                alt="Icone"
                width={37}
                height={37}
                className="transform transition-all duration-200 hover:scale-105 cursor-pointer"
              />
            </button>

            <div
              className={`absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border border-gray-200 z-50
                transform transition-all duration-200 ease-out
                ${
                  isProfileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }
              `}
            >
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  console.log("Sair clicado");
                  // Aguardando backend para colocar função de logout
                }}
              >
                Sair
              </button>
            </div>
          </div>
        </ul>
      </nav>
    </header>
  );
}
