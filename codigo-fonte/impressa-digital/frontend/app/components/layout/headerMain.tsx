"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "../../contexts/Authprovider";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from "./searchBar";


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
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<Categoria[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Produto[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const categoriesRef = useRef<HTMLLIElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { itemCount } = useCart();
  const { user } = useAuth();

  const menuItems = ["Sobre nós", "Contato"];

    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesOpen(false);
      }

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch("http://localhost:3000/categories");
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
    if (searchTerm.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const normalize = (str: string) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const timeout = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const res = await fetch("http://localhost:3000/products");
        const data: Produto[] = await res.json();

        const filtered = data.filter(
          (p) =>
            normalize(p.nome).includes(normalize(searchTerm)) ||
            normalize(p.categoria?.nome || "").includes(normalize(searchTerm))
        );

        setSearchResults(filtered);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const toggleCategoriesDropdown = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
    setIsOpen(false);
  };

  const closeCategoriesDropdown = () => setIsCategoriesOpen(false);

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


  return (
    <header className="w-full shadow-sm bg-white sticky top-0 z-50 border-b border-gray-100">
      <div className="flex items-center justify-between gap-6 px-6 md:px-16 py-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo_impressa_digital.png"
            alt="Logo"
            width={160}
            height={60}
            className="object-contain"
          />
        </Link>

        {/* Menu desktop */}
        <div className="hidden md:flex items-center justify-center gap-4">
          <ul className="flex gap-4 items-center">
            <li className="relative" ref={categoriesRef}>
              <button
                onClick={toggleCategoriesDropdown}
                className="bg-[#3cc10c] rounded-full px-6 py-2 text-white uppercase text-sm font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
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
                          onClick={closeCategoriesDropdown}
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

            {menuItems.map((item) => (
              <li key={item}>
                <Link
                  href={
                    item === "Sobre nós"
                      ? "/about_us"
                      : `/${item.toLowerCase().replace(" ", "-")}`
                  }
                  className="bg-[#3cc10c] rounded-full px-6 py-2 text-white uppercase text-sm font-bold hover:bg-green-700 transition shadow-sm"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      {/* Barra de busca Desktop */}
      <div className="hidden md:block flex-1 mx-6">
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


        {/* Carrinho */} 
        <Link href="/perfil/carrinho" 
        className="flex items-center cursor-pointer relative" > {itemCount > 0 && ( <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"> {itemCount} </span> )} <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1a9d20" > 
        <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80ZM680-80q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" /> </svg> </Link>

          <div className="relative" ref={userMenuRef}>

            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <div
                className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-lg border border-gray-300"
              >
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
                      <Link href="/perfil" className="block px-4 py-2 hover:bg-gray-50">
                        Meu Perfil
                      </Link>
                      {(user.role === "owner" || user.role === "admin") && (
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 hover:bg-gray-50"
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => console.log("Logout")}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Sair
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
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

    {/* Mobile Search */}
    <div className="md:hidden px-6 pb-3">
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

    </header>
  );
}
