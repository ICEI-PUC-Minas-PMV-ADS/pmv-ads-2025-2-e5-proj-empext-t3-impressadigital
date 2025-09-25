"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProdutosGrid from "./ProdutosGrid";

interface Product {
  id: number;
  nome: string;
  preco: number;
  categoria_id: number;
  descricao?: string;
  categoria_nome?: string;
  midias?: Array<{
    id: number;
    url: string;
  }>;
  status?: string;
}

interface Category {
  id: number;
  nome: string;
}

export default function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // Exemplo: buscar produto com id 1 — substitua pela sua lógica (rota/param)
        const res = await fetch(`http://localhost:3000/products/3`);
        if (!res.ok) throw new Error("Erro ao buscar produto");
        const data = (await res.json()) as Product;

        // Buscar categorias (tipado)
        const catRes = await fetch("http://localhost:3000/categories");
        if (!catRes.ok) throw new Error("Erro ao buscar categorias");
        const cats = (await catRes.json()) as Category[];

        // Aqui não usamos `any`: o `cats` já é Category[], então `c` é Category
        const categoriaNome = cats.find((c) => c.id === data.categoria_id)?.nome;

        setProduct({
          ...data,
          categoria_nome: categoriaNome,
          status: data.status === "inativo" ? "Inativo" : "Ativo",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const formatPrice = (price?: number) => {
    if (typeof price !== "number") return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-500">Erro: {error}</div>;
  if (!product) return <div>Nenhum produto encontrado.</div>;

  return (
    <section className="p-10 bg-white shadow rounded-lg">
  
        < div
       className = "flex flex-col md:flex-row gap-3" >
        {/* Imagem */}
        <div className="flex justify-center py-5 w-full md:w-1/3 bg-[#F3F3F3] rounded-lg">
          <div className="flex items-center px-2 bg-white rounded-lg">
            <Image
              src={product.midias?.[0]?.url || "/images/placeholder.png"}
              width={300}
              height={300}
              alt={product.nome}
              className="rounded-lg shadow"
            />
          </div>
        </div>

        {/* Informações */}
        <div className="w-full md:w-2/3 flex flex-col">
          <h1 className="text-2xl font-bold">{product.nome}</h1>

          <span
            className="text-black font-bold mt-2 px-4 py-1 rounded-2xl w-fit"
            style={{ background: "#3DF034" }}
          >
            {product.categoria_nome || "Sem categoria"}
          </span>

          <p className="text-[32px] font-sans font-[inter] font-bold mt-2">
            {formatPrice(product.preco)}
          </p>

          <input
            type="text"
            placeholder="Escreva nome e idade"
            className="bg-[#e6e6e6] text-[#6B6B6B] text-lg pl-4 rounded-2xl p-2 w-2/3 mt-4 focus:outline-[#3DF034]"
          />

          <button className="bg-[#3DF034] text-black font-bold px-4 py-2 rounded mt-4 w-fit">
            Adicionar ao carrinho
          </button>

          <p className="mt-4 text-gray-700">{product.descricao}</p>
        </div>
      </div>
        
    </section>
  );
}
