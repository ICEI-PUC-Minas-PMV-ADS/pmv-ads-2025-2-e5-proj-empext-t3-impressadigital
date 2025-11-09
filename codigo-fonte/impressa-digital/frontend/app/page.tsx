"use client";
 
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import HeaderDashboard from "@/app/components/layout/headerMain";
import Carrossel from "./components/layout/Carrossel";
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
    <div className="min-h-screen bg-white flex flex-col">
      <HeaderDashboard/>
       
      <ProdutosGrid titulo="Produtos em Destaque" produtos={produtos} produtosPorPagina={12} />

          <Footer />
    </div>
    
  );
      
}
 