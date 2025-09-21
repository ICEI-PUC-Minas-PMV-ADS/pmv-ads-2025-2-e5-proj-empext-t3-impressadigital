"use client";

import { useState } from "react";

interface Produto {
  nome: string;
  imagem: string;
}

interface ProdutosGridProps {
  titulo: string;
  produtos: Produto[];
  produtosPorPagina?: number; // opcional, padrão 30
}

export default function ProdutosGrid({
  titulo,
  produtos,
  produtosPorPagina = 30,
}: ProdutosGridProps) {
  const [paginaAtual, setPaginaAtual] = useState(1);

  const totalPaginas = Math.ceil(produtos.length / produtosPorPagina);

  // Produtos que serão exibidos na página atual
  const produtosPaginaAtual = produtos.slice(
    (paginaAtual - 1) * produtosPorPagina,
    paginaAtual * produtosPorPagina
  );

  return (
    <main className="flex-1 p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">{titulo}</h2>

      {/* Grid de produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {produtosPaginaAtual.map((produto, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Polaroid */}
            <div className="bg-white rounded-md shadow-lg overflow-hidden relative w-64">
              <div className="p-2 pt-4 flex justify-center">
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-52 h-52 object-cover rounded-md shadow-sm"
                />
              </div>
              <div className="text-center p-6">
                <h1 className="font-bold text-gray-800 text-sm mb-2">{produto.nome}</h1>
                <button className="bg-green-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-green-700 transition text-sm">
                  Ver opções
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`px-3 py-1 rounded ${
                num === paginaAtual ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setPaginaAtual(num)}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
