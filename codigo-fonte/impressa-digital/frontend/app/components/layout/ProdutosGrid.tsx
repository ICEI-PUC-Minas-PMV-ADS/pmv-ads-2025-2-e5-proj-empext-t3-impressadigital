"use client";

import { useState } from "react";

interface Produto {
  id: number;
  nome: string;
  imagem?: string; // opcional
  // pode vir string (do backend) ou number
  preco?: number | string;
}

interface ProdutosGridProps {
  titulo: string;
  produtos: Produto[];
  produtosPorPagina?: number; // padrão 30
}

function parsePrecoToNumber(val: number | string | undefined): number | null {
  if (val === undefined || val === null) return null;
  if (typeof val === "number") {
    return Number.isFinite(val) ? val : null;
  }
  if (typeof val !== "string") return null;

  // remove símbolos e espaços (ex: "R$ 1.234,56" -> "1.234,56")
  const cleaned = val.replace(/[^\d,.-]/g, "").trim();
  if (!cleaned) return null;

  let normalized = cleaned;

  // Se tiver '.' e ',' — assume '.' milhares e ',' decimal (ex: "1.234,56")
  if (cleaned.includes(".") && cleaned.includes(",")) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (cleaned.includes(",")) {
    // "1234,56" -> "1234.56"
    normalized = cleaned.replace(",", ".");
  } // se só tem ponto, mantém (ex: "1234.56")

  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export default function ProdutosGrid({
  titulo,
  produtos,
  produtosPorPagina = 30,
}: ProdutosGridProps) {
  const [paginaAtual, setPaginaAtual] = useState(1);

  const totalPaginas = Math.max(1, Math.ceil(produtos.length / produtosPorPagina));

  const produtosPaginaAtual = produtos.slice(
    (paginaAtual - 1) * produtosPorPagina,
    paginaAtual * produtosPorPagina
  );

  return (
    <main className="flex-1 p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">{titulo}</h2>

      {/* Grid de produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {produtosPaginaAtual.map((produto) => {
          const precoNum = parsePrecoToNumber(produto.preco);
          const precoFormatado =
            precoNum !== null
              ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(precoNum)
              : null;

          return (
            <div key={produto.id} className="flex flex-col items-center">
              {/* Card estilo polaroid */}
              <div className="bg-white rounded-md shadow-lg overflow-hidden relative w-64">
                <div className="p-2 pt-4 flex justify-center">
                  <img
                    src={produto.imagem || "/images/placeholder.png"}
                    alt={produto.nome}
                    className="w-52 h-52 object-cover rounded-md shadow-sm"
                  />
                </div>
                <div className="text-center p-6">
                  <h1 className="font-bold text-gray-800 text-sm mb-2">{produto.nome}</h1>

                  {/* Mostra o preço somente se conseguimos converter para number */}
                  {precoFormatado && (
                    <p className="text-green-700 font-semibold mb-2">{precoFormatado}</p>
                  )}

                  <button className="bg-green-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-green-700 transition text-sm">
                    Ver opções
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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
