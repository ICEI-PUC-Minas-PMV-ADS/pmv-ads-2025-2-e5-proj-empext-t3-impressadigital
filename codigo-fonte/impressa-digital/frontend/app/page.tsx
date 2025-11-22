"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import HeaderDashboard from "@/app/components/layout/headerMain";
import ProdutosGrid from "./components/layout/ProdutosGrid";
import Footer from "@/app/components/layout/footer";

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

export default function Home({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const data: Produto[] = await res.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    fetchProdutos();
  }, []);

  return (
    <div>

    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <HeaderDashboard />

      {/* Container central igual Mercado Livre */}
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <ProdutosGrid 
          titulo="Produtos em Destaque" 
          produtos={produtos} 
          produtosPorPagina={12} 
          />
      </div>
          </div>
     <Footer />
    </div>
  
  );
}
