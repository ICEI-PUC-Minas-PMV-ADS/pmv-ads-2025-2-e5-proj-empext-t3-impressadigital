"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "../../contexts/Authprovider";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from "./searchBar";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

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
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const menuItems = ["Sobre nós", "Contato"];

  // Fecha menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) setIsCategoriesOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Busca com debounce
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
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(prev => (prev + 1) % searchResults.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex(prev => (prev === 0 ? searchResults.length - 1 : prev - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); const sel = searchResults[activeIndex]; if (sel) window.location.href = `/product/${sel.slug ?? sel.id}`; }
  };

  return (
    <header className="w-full shadow-sm bg-white sticky top-0 z-50 border-b border-gray-100">
      {/* Top container: logo + icons */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        <Link href="/" className="flex-shrink-0">
          <Image src="/images/logo_impressa_digital.png" alt="Logo" width={140} height={50} className="object-contain" />
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <Link href="/perfil/carrinho" className="relative">
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {itemCount}
              </span>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1a9d20">
              <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80ZM680-80q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
            </svg>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="focus:outline-none">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-4">
          <ul className="flex gap-3 items-center">
            <li className="relative" ref={categoriesRef}>
              <button onClick={() => setIsCategoriesOpen(!isCategoriesOpen)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold uppercase flex items-center gap-2 shadow-sm">
                Categorias <span className={`${isCategoriesOpen ? "rotate-180" : ""} transition-transform`}>▼</span>
              </button>
              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-xl shadow-xl z-50 p-4 border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase font-semibold border-b pb-1 mb-2">Explore Nossos Produtos</p>
                    {loadingCategories ? <p className="text-gray-500 text-sm italic">Carregando...</p> : allCategories.map(cat => (
                      <Link key={cat.id} href={`/categorias/${cat.slug}`} onClick={() => setIsCategoriesOpen(false)} className="block py-1.5 text-gray-700 hover:text-green-700 transition">{cat.nome}</Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
            {menuItems.map(item => (
              <li key={item}>
                <Link href={item === "Sobre nós" ? "/about_us" : `/${item.toLowerCase().replace(" ", "-")}`} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold uppercase shadow-sm">{item}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 mx-6">
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

        {/* Desktop user */}
        <div className="hidden md:flex items-center gap-4 relative" ref={userMenuRef}>
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-lg border border-gray-300">{user?.name?.charAt(0).toUpperCase() ?? "?"}</div>
          </button>
          <AnimatePresence>
            {showUserMenu && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-3 bg-white border border-gray-200 shadow-lg rounded-lg w-48 z-50">
                {user ? (
                  <>
                    <Link href="/perfil" className="block px-4 py-2 hover:bg-gray-50">Meu Perfil</Link>
                    {(user.role === "owner" || user.role === "admin") && <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-50">Dashboard</Link>}
                    <button onClick={async () => { try { await logout(); setToast({ message: "Você saiu da sua conta.", type: "success" }); } catch { setToast({ message: "Erro ao sair da conta.", type: "error" }); } finally { setShowUserMenu(false); }}} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer">Sair</button>
                  </>
                ) : (<Link href="/login" className="block px-4 py-2 hover:bg-gray-50 text-green-600">Entrar</Link>)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile menu completo */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-t border-gray-100 flex flex-col gap-3 py-4 px-4">
            {/* Busca mobile */}
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchResults={searchResults} loadingSearch={loadingSearch} activeIndex={activeIndex} setActiveIndex={setActiveIndex} handleKeyDown={handleKeyDown} />

            {/* Menu links */}
            {menuItems.map(item => (
              <Link key={item} href={item === "Sobre nós" ? "/about_us" : `/${item.toLowerCase().replace(" ", "-")}`} onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-green-600 transition py-2 px-3 rounded-md">{item}</Link>
            ))}

            {/* Categorias collapsible */}
            <button onClick={() => setIsCategoriesOpen(!isCategoriesOpen)} className="text-gray-700 hover:text-green-600 transition py-2 px-3 rounded-md text-left flex justify-between items-center">
              Categorias <span className={`${isCategoriesOpen ? "rotate-180" : ""} transition-transform`}>▼</span>
            </button>
            <AnimatePresence>
              {isCategoriesOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pl-4 flex flex-col gap-1">
                  {loadingCategories ? <p className="text-gray-500 text-sm italic">Carregando...</p> : allCategories.map(cat => (
                    <Link key={cat.id} href={`/categorias/${cat.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-green-600 transition py-1">{cat.nome}</Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* User links */}
            {user ? (
              <>
                <Link href="/perfil" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-green-600 py-2 px-3 rounded-md">Meu Perfil</Link>
                {(user.role === "owner" || user.role === "admin") && <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-green-600 py-2 px-3 rounded-md">Dashboard</Link>}
                <button onClick={async () => { try { await logout(); setToast({ message: "Você saiu da sua conta.", type: "success" }); } catch { setToast({ message: "Erro ao sair da conta.", type: "error" }); } finally { setIsMobileMenuOpen(false); }}} className="text-red-600 py-2 px-3 text-left w-full hover:bg-red-50 rounded-md">Sair</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-green-600 py-2 px-3 rounded-md hover:bg-green-50">Entrar</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </header>
  );
}
