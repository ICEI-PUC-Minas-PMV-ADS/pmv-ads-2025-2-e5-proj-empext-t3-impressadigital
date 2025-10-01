"use client";

import { Produto } from "@/app/hooks/useProdutos";
import { useEffect, useState } from "react";

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const res = await fetch("http://localhost:3000/products");
        const data: Produto[] = await res.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    fetchProdutos();
  }, []);

  return (
    <div className="bg-white min-h-screen p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {produtos.map((produto: Produto) => (
          <div
            key={produto.id}
            className="max-w-xs w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Imagem */}
            <img
              src={produto.imagem || "https://38.media.tumblr.com/5255a42417a419b49c8e1f0014a996ad/tumblr_nmr2wsqrcl1tcuj64o1_400.gif"} // placeholder caso não tenha
              alt={produto.nome}
              className="w-full h-48 object-cover"
            />

            {/* Conteúdo do card */}
            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-gray-800 font-semibold text-lg truncate">
                {produto.nome}
              </h2>
              <p className="text-gray-900 font-bold text-xl">R$ {produto.preco}</p>
              {produto.freeShipping && (
                <span className="text-green-600 font-medium text-sm">
                  Frete grátis
                </span>
              )}
              <button className="mt-2 bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                Colocar no carrinho
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
