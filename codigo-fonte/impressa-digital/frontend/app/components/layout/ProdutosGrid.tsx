"use client";

import Link from "next/link";
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
  slug: string;
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
    <main className="flex-1 py-6 w-full bg-[#F9FAFB] rounded-x100 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden">

      {/* CONTAINER ESTILO MERCADO LIVRE */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-6">
          {titulo}
        </h2>

        {/* GRID RESPONSIVO */}
        <div
          className="
          grid
          grid-cols-1       
          sm:grid-cols-2     
          md:grid-cols-3     
          lg:grid-cols-4     
          gap-4 sm:gap-6
        ">
          {produtosPaginaAtual.map((produto) => {
            const precoNum = parsePrecoToNumber(produto.preco);
            const precoFormatado =
              precoNum !== null
                ? new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(precoNum)
                : null;

            const imagemPrincipal = produto.midias?.find((m) => m.tipo === "imagem")?.url;

            return (
              <Link
                key={produto.id}
                href={`/product/${produto.slug}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col overflow-hidden"
              >
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={imagemPrincipal || "/images/placeholder.png"}
                    alt={produto.nome}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3 text-center flex flex-col flex-1">
                  <h1 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">
                    {produto.nome}
                  </h1>

                  {precoFormatado && (
                    <p className="text-green-700 font-semibold text-sm mb-3">
                      {precoFormatado}
                    </p>
                  )}

                  {/* <button className="mt-auto bg-green-600 text-white font-medium px-3 py-2 rounded-full hover:bg-green-700 transition text-xs">
                    Ver opções
                  </button> */}
                </div>
              </Link>
            );
          })}
        </div>

        {/* PAGINAÇÃO */}
        {totalPaginas > 1 && (
          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  num === paginaAtual
                    ? "bg-green-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setPaginaAtual(num)}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
