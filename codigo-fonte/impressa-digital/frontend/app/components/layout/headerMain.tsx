"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/contexts/CartContext";
// 1. Importar o hook useAuth
import { useAuth } from "../../contexts/Authprovider"; // AJUSTE O CAMINHO CONFORME A ESTRUTURA REAL DO SEU PROJETO

// Definição de tipos para as categorias
interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

export default function HeaderMain() {
  const [isOpen, setIsOpen] = useState(false); // Menu lateral mobile
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false); // Menu dropdown de categorias (Desktop/Mobile)
  const [animateSearch, setAnimateSearch] = useState(false);
  const [allCategories, setAllCategories] = useState<Categoria[]>([]); // Lista de categorias/produtos
  const { itemCount } = useCart(); // Uso do contexto
  const [loadingCategories, setLoadingCategories] = useState(false);
  // 2. Obter o estado do usuário
  const { user } = useAuth();

  const menuItems = [
    // Removemos "Categorias" daqui, pois será um botão dedicado
    "Sobre nós",
    "Contato",
  ];

  // Função para buscar todas as categorias/produtos
  const fetchAllCategories = async () => {
    setLoadingCategories(true);
    try {
      // **ASSUMINDO ESTE ENDPOINT**
      const res = await fetch("http://localhost:3000/categories");
      if (!res.ok) throw new Error("Erro ao buscar categorias");

      const data: Categoria[] = await res.json();
      setAllCategories(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setAllCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Ativa a animação da busca e carrega as categorias
  useEffect(() => {
    setAnimateSearch(true);
    fetchAllCategories();
  }, []);

  // Handler para alternar o dropdown de categorias e fechar o menu lateral
  // Este handler agora será o ÚNICO responsável por abrir/fechar as categorias
  const toggleCategoriesDropdown = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
    setIsOpen(false); // Garante que o menu lateral mobile feche
  };

  // Handler para fechar o dropdown ao clicar em um item (ou quando necessário)
  const closeCategoriesDropdown = () => {
    setIsCategoriesOpen(false);
  };

  // Lista de Categorias no menu lateral (mobile)
  const CategoriesMobileList = () => (
    <ul className="flex flex-col gap-2 p-2 border-l-4 border-[#2ab906] bg-gray-50">
      {loadingCategories ? (
        <li className="text-gray-500 text-sm italic">Carregando produtos...</li>
      ) : allCategories.length > 0 ? (
        allCategories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/categorias/${cat.slug}`} // Caminho para a página de categoria
              className="text-gray-700 hover:text-green-600 font-normal block py-1 transition"
              onClick={() => {
                setIsOpen(false); // Fecha o menu lateral
                closeCategoriesDropdown(); // Fecha o dropdown (embora não seja estritamente necessário no mobile, é boa prática)
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


  // Renderização do componente...
  return (
    <header className="w-full shadow-md">
      {/* Topo (mantido) */}
      <div className="flex items-center justify-between gap-3 px-6 md:px-20 py-3 relative">
        {/* Hamburger mobile (mantido) */}
        <button
          className="md:hidden text-3xl font-bold mr-4"
          onClick={() => setIsOpen(true)}
        >
          ☰
        </button>

        {/* Logo (mantido) */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo_impressa_digital.png"
            alt="Logo impressa digital"
            width={140}
            height={140}
            className="object-contain"
          />
        </Link>

        {/* Barra de pesquisa - DESKTOP (mantida) */}
        <div className="hidden md:flex flex-1 justify-center px-10">
          <div className="relative w-full max-w-xl">
            <input
              type="search"
              placeholder="Procure produtos aqui..."
              className="w-full rounded-full border border-gray-300 bg-gray-100 px-5 py-3 text-sm placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
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
          </div>
        </div>

        {/* Carrinho (mantido) */}
        <Link
          href="/perfil/carrinho"
          className="flex items-center cursor-pointer hover:background-[#1a9d20] border-green-500 rounded-full p-2 relative"
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

        {/* Login/Perfil (MODIFICADO) */}
        {user ? (
          // Se houver usuário logado, mostre apenas o ícone de user com link para /perfil
          <Link href="/perfil" className="flex items-center gap-2 cursor-pointer hover:opacity-80">
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
            {/* Opcional: Adicionar um nome de usuário, como está no headerDashboard, se desejar */}
            {/* <span className="text-gray-700 font-medium hidden md:block">
              {user.name.split(" ")[0]}
            </span> */}
          </Link>
        ) : (
          // Se não houver usuário logado, mostre a opção de Iniciar sessão/Login
          <>
            <Link href="/login">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
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
              </div>
            </Link>
            <a href="/login" className="text-gray-700 font-medium hidden md:block">
              Iniciar sessão
            </a>
          </>
        )}
      </div>

      {/* Barra de pesquisa - MOBILE (mantida) */}
      <div
        className={`flex md:hidden w-full px-6 pb-3 transition-all duration-500 ${animateSearch
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5"
          }`}
      >
        <div className="relative w-full">
          <input
            type="search"
            placeholder="Procure produtos aqui..."
            className="w-full rounded-full border border-gray-300 bg-gray-100 px-5 py-3 text-sm placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
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
        </div>
      </div>

      {/* Menu verde desktop */}
      <div className="hidden md:flex w-full items-center justify-center gap-6 py-3 relative">
        <ul className="flex flex-wrap gap-3 justify-center">
          {/* Botão Categorias/Produtos (Dropdown) */}
          <li
            className="relative"
          // REMOVIDOS onMouseEnter e onMouseLeave para o comportamento de clique
          >
            <button
              onClick={toggleCategoriesDropdown} // CLIQUE abre/fecha
              className="bg-[#2ab906] rounded-full px-8 py-2 text-white uppercase text-sm font-bold cursor-pointer hover:bg-green-600 transition flex items-center gap-2"
            >
              Categorias
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? "transform rotate-180" : ""
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

            {/* Dropdown de Categorias/Produtos */}
            {isCategoriesOpen && (
              <div
                className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-64 bg-white rounded-lg shadow-xl z-50 p-4 border border-gray-100"
              // REMOVIDOS onMouseEnter e onMouseLeave do dropdown
              >
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-400 uppercase font-semibold border-b pb-1 mb-1">Explore Nossos Produtos</p>
                  {loadingCategories ? (
                    <p className="text-gray-500 text-sm italic">Carregando...</p>
                  ) : allCategories.length > 0 ? (
                    allCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categorias/${cat.slug}`} // Link para a página da categoria
                        onClick={closeCategoriesDropdown} // FECHA ao clicar em um item
                        className="text-gray-700 hover:text-green-600 font-medium transition block py-1 border-b last:border-b-0"
                      >
                        {cat.nome}
                      </Link>
                    ))
                  ) : (
                    <p className="text-red-500 text-sm">Erro ao carregar.</p>
                  )}
                </div>
              </div>
            )}
          </li>

          {/* Outros itens do menu (CORRIGIDO) */}
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="bg-[#2ab906] rounded-full px-8 py-2 text-white uppercase text-sm font-bold cursor-pointer hover:bg-green-600 transition"
            >
              {/* CORREÇÃO AQUI */}
              <Link
                href={item === "Sobre nós" ? "/about_us" : `/${item.toLowerCase().replace(" ", "-")}`}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* WhatsApp desktop (mantido) */}

        <div className="ml-4 flex items-center">
          <a
            href="https://wa.me/5531991407186"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/iconWhatsapp.png"
              alt="Icone whatsapp"
              width={60}
              height={60}
              className="object-contain cursor-pointer"
            />
          </a>
        </div>
      </div>

      {/* Menu lateral mobile (mantido) */}
      {isOpen && (
        <>
          {/* Overlay para fechar (mantido) */}
          <div
            className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-50 z-40"
            onClick={() => {
              setIsOpen(false);
              closeCategoriesDropdown(); // Boa prática: fecha categorias se fechar o menu lateral
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
              {/* Botão Categorias no Mobile (mantido com toggle) */}
              <li className="bg-[#2ab906] text-white rounded-full px-4 py-2 text-center font-bold cursor-pointer hover:bg-green-600">
                <button
                  onClick={toggleCategoriesDropdown} // CLIQUE abre/fecha
                  className="w-full flex items-center justify-center gap-2"
                >
                  Categorias
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? "transform rotate-180" : ""
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

              {/* Dropdown de Categorias no Mobile (mantido) */}
              {isCategoriesOpen && <CategoriesMobileList />}

              {/* Outros Itens do Menu Mobile (CORRIGIDO) */}
              {menuItems.map((cat, index) => (
                <li
                  key={index}
                  className="bg-[#2ab906] text-white rounded-full px-4 py-2 text-center font-bold cursor-pointer hover:bg-green-600"
                >
                  {/* CORREÇÃO AQUI */}
                  <Link 
                    href={cat === "Sobre nós" ? "/about_us" : `/${cat.toLowerCase().replace(" ", "-")}`} 
                    onClick={() => setIsOpen(false)}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>

            {/* WhatsApp mobile (mantido) */}
            <div className="mt-auto">
              <a
                href="https://wa.me/5531991407186"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/iconWhatsapp.png"
                  alt="Icone whatsapp"
                  width={60}
                  height={60}
                  className="object-contain cursor-pointer"
                />
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
