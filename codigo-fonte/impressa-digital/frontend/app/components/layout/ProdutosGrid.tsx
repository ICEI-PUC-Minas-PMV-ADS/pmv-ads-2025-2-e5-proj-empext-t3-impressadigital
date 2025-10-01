"use client";

import { useState } from "react";

interface Imagem {
  id: number;
  url: string;
  tipo: "imagem" | "video";
  produtoId: number;
}

interface Produto {
  id: number;
  nome: string;
  preco?: number | string;
  midias?: Imagem[];
}

interface ProdutosGridProps {
  titulo: string;
  produtos: Produto[];
  produtosPorPagina?: number;
}

function parsePrecoToNumber(val: number | string | undefined): number | null {
  if (val === undefined || val === null) return null;
  if (typeof val === "number") return Number.isFinite(val) ? val : null;
  if (typeof val !== "string") return null;

  const cleaned = val.replace(/[^\d,.-]/g, "").trim();
  if (!cleaned) return null;

  let normalized = cleaned;
  if (cleaned.includes(".") && cleaned.includes(",")) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (cleaned.includes(",")) {
    normalized = cleaned.replace(",", ".");
  }

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {produtosPaginaAtual.map((produto) => {
          const precoNum = parsePrecoToNumber(produto.preco);
          const precoFormatado =
            precoNum !== null
              ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(precoNum)
              : null;

          const imagemPrincipal = produto.midias?.find((m) => m.tipo === "imagem")?.url;

          return (
            <div key={produto.id} className="flex flex-col items-center">
              <div className="bg-white rounded-md shadow-lg overflow-hidden relative w-64">
                <div className="p-2 pt-4 flex justify-center">
                  <img
                    src={imagemPrincipal || "/images/placeholder.png"}
                    alt={produto.nome}
                    className="w-52 h-52 object-cover rounded-md shadow-sm"
                  />
                </div>
                <div className="text-center p-6">
                  <h1 className="font-bold text-gray-800 text-sm mb-2">{produto.nome}</h1>
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
