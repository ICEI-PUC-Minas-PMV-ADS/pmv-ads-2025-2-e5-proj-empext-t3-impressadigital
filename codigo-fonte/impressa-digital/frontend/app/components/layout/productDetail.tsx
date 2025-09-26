// components/layout/productDetail.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Category {
  id: number;
  nome: string;
}

// A entidade Produtos do backend inclui a categoria e mídias
interface Product {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  slug: string; // Adicionado para garantir tipagem
  status?: string;
  categoria: Category; // Categoria completa vem da busca por slug no backend
  midias?: Array<{
    id: number;
    url: string;
  }>;
}

interface ProductDetailsProps {
    // Renomeado para ser mais genérico
    productIdentifier: string | string[] | undefined; 
}

export default function ProductDetails({ productIdentifier }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productIdentifier) {
        setError("Identificador do produto não fornecido.");
        setLoading(false);
        return;
    }
    
    // Garantir que seja uma string se for um array de um elemento
    const slug = Array.isArray(productIdentifier) ? productIdentifier[0] : productIdentifier;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        // *** MUDANÇA PRINCIPAL: Buscar produto usando o endpoint de SLUG ***
        const res = await fetch(`http://localhost:3000/products/slug/${slug}`);
        if (!res.ok) throw new Error("Erro ao buscar produto");
        const data = (await res.json()) as Product;

        // O backend já retorna 'categoria' com 'nome', simplificando
        setProduct({
          ...data,
          status: data.status === "inativo" ? "Inativo" : "Ativo",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productIdentifier]);

  const formatPrice = (price?: number) => {
    if (typeof price !== "number") return "";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-500">Erro: {error}</div>;
  if (!product) return <div>Produto não encontrado.</div>;

  return (
    <div className="flex flex-col md:flex-row p-6 items-start gap-4">
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
          {/* Acessamos o nome da categoria que veio na busca */}
          {product.categoria?.nome || "Sem categoria"} 
        </span>

        <p className="text-[32px] font-sans font-[inter] font-bold mt-2">
          {formatPrice(product.preco)}
        </p>
        
        <p className="mt-4 text-gray-700">{product.descricao}</p>

        <input
          type="text"
          placeholder="Escreva nome e idade"
          className="bg-[#e6e6e6] text-[#6B6B6B] text-lg pl-4 rounded-2xl p-2 w-2/3 mt-4 focus:outline-none"
        />
        <p className="text-[#35B814] text-lg mt-4 font-semibold">
          Produto: {product.status}
        </p>
      </div>
    </div>
  );
}