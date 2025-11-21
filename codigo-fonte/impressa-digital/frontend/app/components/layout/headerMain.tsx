"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "../../contexts/Authprovider";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from "./searchBar";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FiMenu, FiX } from "react-icons/fi"; 


const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-4 sm:px-5 py-2 sm:py-3 rounded-lg shadow-lg text-white font-medium backdrop-blur-sm ${
            type === "success" ? "bg-green-600/95" : "bg-red-600/95"
          }`}
        >
          {type === "success" ? (
            <AiOutlineCheckCircle className="text-xl sm:text-2xl" />
          ) : (
            <AiOutlineCloseCircle className="text-xl sm:text-2xl" />
          )}
          <span className="text-sm sm:text-base">{message}</span>
          <button
            onClick={onClose}
            aria-label="Fechar notificação"
            className="ml-2 sm:ml-3 text-white/80 hover:text-white transition-colors text-lg leading-none"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

interface Produto {
  id: number;
  nome: string;
  slug?: string;
  categoria?: { nome: string };
}

export default function HeaderMain() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<Categoria[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Produto[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const categoriesRef = useRef<HTMLLIElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const menuItems = ["Sobre nós", "Contato"];

  // Funções de toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsCategoriesOpen(false); 
  };
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Função central para abrir/fechar categorias (toggle)
  const toggleCategoriesDropdown = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const closeCategoriesDropdown = () => setIsCategoriesOpen(false);

  // Efeito para fechar menus ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // Fecha Dropdown de Categorias (Desktop)
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(target)
      ) {
        const categoriesButton = categoriesRef.current.querySelector('button');
        if (categoriesButton && !categoriesButton.contains(target)) {
          setIsCategoriesOpen(false);
        }
      }

      // Fecha Menu do Usuário
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setShowUserMenu(false);
      }
      
      // Fecha Menu Mobile
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        isMobileMenuOpen
      ) {
        const mobileButton = document.getElementById('mobile-menu-button');
        if (mobileButton && mobileButton.contains(target)) return;
        
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Fetch categorias
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (!res.ok) throw new Error("Erro ao buscar categorias");
        const data: Categoria[] = await res.json();
        setAllCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length < 3) { setSearchResults([]); return; }
    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const timeout = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const data: Produto[] = await res.json();
        setSearchResults(
          data.filter(
            p =>
              normalize(p.nome).includes(normalize(searchTerm)) ||
              normalize(p.categoria?.nome || "").includes(normalize(searchTerm))
          )
        );
      } catch {
        setSearchResults([]);
      } finally { setLoadingSearch(false); }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchResults.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? searchResults.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = searchResults[activeIndex];
      if (selected) {
        window.location.href = `/product/${selected.slug ?? selected.id}`;
      }
    }
  };

  // =========================================================================
  // RENDERIZAÇÃO
  // =========================================================================

  return (
    <header className="w-full shadow-sm bg-white sticky top-0 z-50 border-b border-gray-100">
      <div className="flex items-center justify-between gap-4 px-6 py-4 md:px-8 lg:px-12 xl:px-16 lg:gap-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image src="/images/logo_impressa_digital.png" alt="Logo" width={140} height={50} className="object-contain" />
        </Link>

        {/* Menu desktop (escondido em mobile) */}
        <div className="hidden md:flex items-center justify-center gap-2 flex-shrink lg:gap-4">
          <ul className="flex gap-2 items-center lg:gap-4">
            <li className="relative" ref={categoriesRef}>
              <button
                onClick={toggleCategoriesDropdown} 
                className="bg-[#3cc10c] rounded-full px-4 py-2 text-white uppercase text-xs font-bold hover:bg-green-700 transition flex items-center gap-1 shadow-sm whitespace-nowrap lg:px-6 lg:py-2 lg:text-sm lg:gap-2"
              >
                Categorias
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isCategoriesOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-64 bg-white rounded-xl shadow-xl z-50 p-4 border border-gray-100"
                  >
                    <p className="text-xs text-gray-400 uppercase font-semibold border-b pb-1 mb-2">
                      Explore Nossos Produtos
                    </p>
                    {loadingCategories ? (
                      <p className="text-gray-500 text-sm italic">Carregando...</p>
                    ) : (
                      allCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/categorias/${cat.slug}`}
                          onClick={closeCategoriesDropdown} // Fecha apenas o dropdown no desktop
                          className="block py-1.5 text-gray-700 hover:text-green-600 font-medium transition"
                        >
                          {cat.nome}
                        </Link>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
            {menuItems.map(item => (
              <li key={item}>
                <Link
                  href={
                    item === "Sobre nós"
                      ? "/about_us"
                      : `/${item.toLowerCase().replace(" ", "-")}`
                  }
                  className="bg-[#3cc10c] rounded-full px-4 py-2 text-white uppercase text-xs font-bold hover:bg-green-700 transition shadow-sm whitespace-nowrap lg:px-6 lg:py-2 lg:text-sm"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Barra de busca Desktop (escondida em mobile) */}
        <div className="hidden md:block flex-1 mx-4 lg:mx-8 xl:mx-12 max-w-xl">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchResults={searchResults}
            loadingSearch={loadingSearch}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            handleKeyDown={handleKeyDown}
          />
        </div>

        {/* CONJUNTO DE ÍCONES DE AÇÃO */}
        <div className="flex items-center gap-4 flex-shrink-0">
          
          {/* Botão Menu Hambúrguer (Apenas Mobile) */}
          <button
            id="mobile-menu-button"
            className="md:hidden p-1 text-gray-700 hover:text-green-600 transition"
            onClick={toggleMobileMenu}
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
          
          {/* Carrinho */}
          <Link
            href="/perfil/carrinho"
            className="flex items-center cursor-pointer relative"
          >
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {itemCount}
              </span>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#1a9d20"
            >
              <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80ZM680-80q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
            </svg>
          </Link>

          {/* Menu do usuário */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-lg border border-gray-300">
                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
              </div>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-3 bg-white border border-gray-200 shadow-lg rounded-lg w-48 z-50"
                >
                  {user ? (
                    <>
                      <Link
                        href="/perfil"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 hover:bg-gray-50"
                      >
                        Meu Perfil
                      </Link>
                      {(user.role === "owner" || user.role === "admin") && (
                        <Link
                          href="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 hover:bg-gray-50"
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={async () => {
                          try {
                            await logout();
                            setToast({
                              message: "Você saiu da sua conta.",
                              type: "success",
                            });
                          } catch {
                            setToast({
                              message: "Erro ao sair da conta.",
                              type: "error",
                            });
                          } finally {
                            setShowUserMenu(false);
                          }
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        Sair
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 hover:bg-gray-50 text-green-600"
                    >
                      Entrar
                    </Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MENU MOBILE (Sidebar/Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Drawer/Sidebar */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-2xl z-40 p-6 md:hidden overflow-y-auto"
            >
              <div className="flex justify-end mb-4">
                <button
                  onClick={closeMobileMenu}
                  className="text-gray-500 hover:text-gray-800"
                  aria-label="Fechar menu"
                >
                  <FiX className="w-7 h-7" />
                </button>
              </div>
              
              {/* Barra de busca Mobile dentro do menu */}
              <div className="mb-6">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  searchResults={searchResults}
                  loadingSearch={loadingSearch}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  handleKeyDown={handleKeyDown}
                />
              </div>

              {/* Menu de Categorias Mobile */}
              <div className="mb-6 border-t pt-4">
                <button
                  onClick={toggleCategoriesDropdown} 
                  className="w-full text-left flex justify-between items-center text-lg font-bold text-gray-700 hover:text-green-600 mb-2"
                >
                  Categorias
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isCategoriesOpen ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4"
                    >
                      {loadingCategories ? (
                        <p className="py-1 text-gray-500 text-sm italic">Carregando...</p>
                      ) : (
                        allCategories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/categorias/${cat.slug}`}
                            onClick={() => {
                                closeMobileMenu(); // Fecha o menu lateral
                                closeCategoriesDropdown(); // <--- CHAMA A FUNÇÃO PARA FECHAR O DROPDOWN!
                            }}
                            className="block py-1.5 text-gray-600 hover:text-green-600 transition text-base"
                          >
                            {cat.nome}
                          </Link>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Links Estáticos Mobile */}
              <nav className="flex flex-col gap-2 border-t pt-4">
                {menuItems.map((item) => (
                  <Link
                    key={item}
                    href={
                      item === "Sobre nós"
                        ? "/about_us"
                        : `/${item.toLowerCase().replace(" ", "-")}`
                    }
                    onClick={closeMobileMenu}
                    className="text-lg font-bold text-gray-700 hover:text-green-600 transition py-2 border-b"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
              
            </motion.div>

            {/* Overlay para fechar o menu ao clicar fora */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={closeMobileMenu}
            />
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </header>
  );
}