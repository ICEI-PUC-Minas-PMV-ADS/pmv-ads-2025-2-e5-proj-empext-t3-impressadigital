"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import HeaderDashboard from "../app/components/layout/headerDashboard";
import Navbar from "../app/components/layout/navbar";
import Carrossel from "./components/layout/Carrossel";
import ProdutosGrid from "./components/layout/ProdutosGrid";

interface Produto {
  id: number;
  nome: string;
  preco?: number | string;
  imagem?: string;
}

export default function Home({ children }: { children: ReactNode }) {
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
    <div className="min-h-screen bg-white flex flex-col">
      <HeaderDashboard />
      <Navbar />
      <Carrossel />
      <ProdutosGrid titulo="Produtos em Destaque" produtos={produtos} produtosPorPagina={12} />
    </div>
  );
}
