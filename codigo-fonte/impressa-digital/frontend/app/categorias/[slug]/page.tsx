"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import HeaderDashboard from "@/app/components/layout/headerMain";
import ProdutosGrid from "@/app/components/layout/ProdutosGrid";
import Footer from "@/app/components/layout/footer"; // ⬅️ IMPORTAÇÃO DO FOOTER

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

interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  slug: string;
  produtos?: Produto[];
}

export default function CategoriaPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [produtosComMidias, setProdutosComMidias] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar os produtos com todos os campos, incluindo a mídia
  const fetchProdutoCompleto = async (produtoId: number): Promise<Produto | null> => {
    try {
      const res = await fetch(`http://localhost:3000/products/${produtoId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.error(`Erro ao buscar produto ${produtoId}:`, error);
    }
    return null;
  };

  const fetchCategoria = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/categories/slug/${slug}`);
      if (!res.ok) throw new Error("Categoria não encontrada");

      const data: Categoria = await res.json();
      setCategoria(data);

      // Buscar todos os produtos que foram carregados na função de produtos completos
      if (data.produtos && data.produtos.length > 0) {       
        const produtosCompletosPromises = data.produtos.map(async (produtoBasico) => {
          const produtoCompleto = await fetchProdutoCompleto(produtoBasico.id);
          if (produtoCompleto) {
            return produtoCompleto;
          }
          return produtoBasico; 
        });

        const produtosCompletos = await Promise.all(produtosCompletosPromises);
        setProdutosComMidias(produtosCompletos);

      } else {
        setProdutosComMidias([]);
      }
    } catch (err) {
      console.error("Erro ao buscar categoria:", err);
      setCategoria(null);
      setProdutosComMidias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoria();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <HeaderDashboard />
        <p className="text-center py-10">Carregando categoria...</p>
        <Footer /> {/* ⬅️ FOOTER RENDERIZADO NO ESTADO DE CARREGAMENTO */}
      </div>
    );
  }

  if (!categoria) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <HeaderDashboard />
        <p className="text-center py-10 text-red-600 font-semibold">
          Categoria não encontrada 🚫
        </p>
        <Footer /> {/* ⬅️ FOOTER RENDERIZADO NO ESTADO DE ERRO */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeaderDashboard />
      {produtosComMidias.length === 0 ? (
        <p className="text-center py-10 text-gray-500">
          Nenhum produto encontrado para esta categoria.
        </p>
      ) : (
        <ProdutosGrid 
          titulo={`Produtos em ${categoria.nome}`} 
          produtos={produtosComMidias} 
          produtosPorPagina={30} 
        />
      )}
      <Footer /> {/* ⬅️ FOOTER RENDERIZADO NO ESTADO DE CONTEÚDO */}
    </div>
  );
}