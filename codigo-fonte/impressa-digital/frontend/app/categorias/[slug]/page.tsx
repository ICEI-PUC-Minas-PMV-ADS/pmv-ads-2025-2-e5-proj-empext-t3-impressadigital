"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import HeaderDashboard from "@/app/components/layout/headerMain";
import ProdutosGrid from "@/app/components/layout/ProdutosGrid";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagem?: string;
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

  // Garantindo que slug é uma string (não array)
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCategoria = async () => {
  if (!slug) return;

  setLoading(true);
  try {
    // ALTERE AQUI para incluir 'slug/' na URL
    const res = await fetch(`http://localhost:3000/categories/slug/${slug}`); 

    if (!res.ok) throw new Error("Categoria não encontrada");

    const data: Categoria = await res.json();
    setCategoria(data);
  } catch (err) {
    // ...
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
      </div>
    );
  }

  const produtos = categoria.produtos ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeaderDashboard />
      {produtos.length === 0 ? (
        <p className="text-center py-10 text-gray-500">
          Nenhum produto encontrado para esta categoria.
        </p>
      ) : (
     <ProdutosGrid titulo="Produtos em Destaque" produtos={produtos} produtosPorPagina={30} />
      )}
    </div>
  );
}
