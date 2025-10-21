"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "../../contexts/Authprovider";

interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

interface Produto {
  id: number;
  nome: string;
  slug?: string;
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

  const { itemCount } = useCart();
  const { user } = useAuth();

  const menuItems = ["Sobre nós", "Contato"];

  // Buscar categorias
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

  // Buscar produtos com debounce
  // useEffect para busca com debounce
useEffect(() => {
  if (searchTerm.trim().length < 3) {
    setSearchResults([]);
    return;
  }

  const timeout = setTimeout(async () => {
    setLoadingSearch(true);
    try {
      const res = await fetch("http://localhost:3000/products");
      const data: Produto[] = await res.json();
      const filtered = data.filter((p) =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }, 300); // espera 300ms depois da última tecla

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
        window.location.href = `/produtos/${selected.slug ?? selected.id}`;
      }
    }
  };

  const SearchBar = () => (
    <div className="relative w-full max-w-md mx-auto flex">
      <input
       autoFocus={true}  
        type="search"
        placeholder="Procure produtos aqui..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        className="flex-1 rounded-l-full border border-gray-300 bg-gray-100 px-5 py-3 text-sm placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
      />
      <button
        className="bg-[#2ab906] hover:bg-green-600 rounded-r-full px-4 flex items-center justify-center text-white"
        type="submit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="22"
          viewBox="0 -960 960 960"
          width="22"
          fill="currentColor"
        >
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
        </svg>
      </button>

      {searchTerm && (
        <div className="absolute z-50 w-full bg-white shadow-lg mt-12 rounded-lg max-h-60 overflow-y-auto border border-gray-200">
          {loadingSearch ? (
            <p className="text-gray-500 p-2">Carregando...</p>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((p, index) => (
                <li
                  key={p.id}
                  className={`px-4 py-2 cursor-pointer ${
                    index === activeIndex
                      ? "bg-green-100 text-green-800"
                      : "text-gray-700 hover:bg-green-50"
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() =>
                    (window.location.href = `/produtos/${p.slug ?? p.id}`)
                  }
                >
                  {p.nome}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 p-4 text-center">
              Nenhum produto encontrado
            </p>
          )}
        </div>
      )}
    </div>
  );

  const CategoriesMobileList = () => (
    <ul className="flex flex-col gap-2 p-2 border-l-4 border-[#2ab906] bg-gray-50">
      {loadingCategories ? (
        <li className="text-gray-500 text-sm italic">Carregando produtos...</li>
      ) : allCategories.length > 0 ? (
        allCategories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/categorias/${cat.slug}`}
              className="text-gray-700 hover:text-green-600 font-normal block py-1 transition"
              onClick={() => {
                setIsOpen(false);
                closeCategoriesDropdown();
              }}
            >
              {cat.nome}
            </Link>
          </li>
        ))
      ) : (
        <li className="text-red-500 text-sm">Nenhuma categoria encontrada.</li>
      )}
    </ul>
  );

  return (
    <header className="w-full shadow-md bg-white">
      <div className="flex items-center justify-between gap-3 px-6 md:px-20 py-3 relative">
        {/* Hamburger mobile */}
        <button
          className="md:hidden text-3xl font-bold"
          onClick={() => setIsOpen(true)}
        >
          ☰
        </button>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo_impressa_digital.png"
            alt="Logo"
            width={140}
            height={140}
            className="object-contain"
          />
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex w-full items-center justify-center gap-4">
          <ul className="flex gap-3 items-center">
            <li className="relative">
              <button
                onClick={toggleCategoriesDropdown}
                className="bg-[#2ab906] rounded-full px-6 py-2 text-white uppercase text-sm font-bold hover:bg-green-600 transition flex items-center gap-2"
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
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isCategoriesOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-64 bg-white rounded-lg shadow-xl z-50 p-4 border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase font-semibold border-b pb-1 mb-1">
                    Explore Nossos Produtos
                  </p>
                  {loadingCategories ? (
                    <p className="text-gray-500 text-sm italic">Carregando...</p>
                  ) : allCategories.length > 0 ? (
                    allCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categorias/${cat.slug}`}
                        onClick={closeCategoriesDropdown}
                        className="text-gray-700 hover:text-green-600 font-medium transition block py-1 border-b last:border-b-0"
                      >
                        {cat.nome}
                      </Link>
                    ))
                  ) : (
                    <p className="text-red-500 text-sm">Erro ao carregar.</p>
                  )}
                </div>
              )}
            </li>

            {menuItems.map((item) => (
              <li
                key={item}
                className="bg-[#2ab906] rounded-full px-6 py-2 text-white uppercase text-sm font-bold hover:bg-green-600 transition"
              >
                <Link
                  href={
                    item === "Sobre nós"
                      ? "/about_us"
                      : `/${item.toLowerCase().replace(" ", "-")}`
                  }
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Barra de busca Desktop */}
        <div className="hidden md:block flex-1 mx-4">
          <SearchBar />
        </div>

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

        {/* Login / Perfil */}
        {user ? (
          <Link
            href="/perfil"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80"
          >
            <div className="flex items-center justify-center rounded-full bg-gray-200 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                fill="#555"
              >
                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
              </svg>
            </div>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80"
          >
            <div className="flex items-center justify-center rounded-full bg-gray-200 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                fill="#555"
              >
                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
              </svg>
              <span className="hidden md:block text-gray-700 font-medium">
                Registrar
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Barra de busca Mobile */}
      <div className="md:hidden px-6 pb-3">
        <SearchBar />
      </div>

      {/* Menu lateral mobile */}
      {isOpen && (
        <>
          <div
            className="fixed top-0 left-0 h-full w-full bg-black opacity-30 z-40"
            onClick={() => {
              setIsOpen(false);
              closeCategoriesDropdown();
            }}
          />
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 p-6 flex flex-col gap-6 animate-slideIn">
            <button
              className="self-end text-gray-600 hover:text-green-600 text-2xl font-bold"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            <ul className="flex flex-col gap-4 mt-4">
              <li className="bg-[#2ab906] text-white rounded-full px-4 py-2 text-center font-bold cursor-pointer hover:bg-green-600">
                <button
                  onClick={toggleCategoriesDropdown}
                  className="w-full flex items-center justify-center gap-2"
                >
                  Categorias
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isCategoriesOpen ? "transform rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>

              {isCategoriesOpen && <CategoriesMobileList />}

              {menuItems.map((cat) => (
                <li
                  key={cat}
                  className="bg-[#2ab906] text-white rounded-full px-4 py-2 text-center font-bold cursor-pointer hover:bg-green-600"
                >
                  <Link
                    href={
                      cat === "Sobre nós"
                        ? "/about_us"
                        : `/${cat.toLowerCase().replace(" ", "-")}`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </header>
  );
}
