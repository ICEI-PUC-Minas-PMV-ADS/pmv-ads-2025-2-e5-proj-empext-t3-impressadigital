// components/SearchBar.tsx
"use client";

import React from "react";

export interface Produto {
  id: number;
  nome: string;
  slug?: string;
  categoria?: { nome: string };
  midias?: { url?: string }[];
  preco?: number;
}

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchResults: Produto[];
  loadingSearch: boolean;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // opcional
}

export function SearchBar({
  searchTerm,
  setSearchTerm,
  searchResults,
  loadingSearch,
  activeIndex,
  setActiveIndex,
  handleKeyDown,
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md mx-auto flex">
      <input
        type="search"
        placeholder="Buscar produtos, categorias ou marcas..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        className="flex-1 rounded-l-full border border-gray-300 bg-gray-100 px-5 py-3 text-sm placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
      />

      <button
        className="bg-[#2ab906] hover:bg-green-600 rounded-r-full px-4 flex items-center justify-center text-white transition"
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

      {/* Dropdown */}
      {searchTerm && (
        <div className="absolute z-50 w-full bg-white shadow-lg mt-12 rounded-lg max-h-72 overflow-y-auto border border-gray-200">
          {loadingSearch ? (
            <p className="text-gray-500 p-3 text-center text-sm">
              Carregando produtos...
            </p>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((p, index) => (
                <li
                  key={p.id}
                  className={`flex items-center gap-3 px-4 py-2 cursor-pointer border-b last:border-b-0 transition ${
                    index === activeIndex ? "bg-green-100" : "hover:bg-green-50"
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() =>
                    (window.location.href = `/product/${p.slug ?? p.id}`)
                  }
                >
                  <div className="w-10 h-10 bg-gray-100 border rounded-md overflow-hidden">
                    <img
                      src={p.midias?.[0]?.url || "/placeholder.jpg"}
                      alt={p.nome}
                      width={40}
                      height={40}
                      style={{ borderRadius: "8px", objectFit: "cover" }}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {p.nome}
                    </p>

                    <p className="text-xs text-gray-500">
                      {p.preco
                        ? `R$ ${Number(p.preco).toFixed(2).replace(".", ",")}`
                        : p.categoria?.nome || ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              Nenhum produto encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
