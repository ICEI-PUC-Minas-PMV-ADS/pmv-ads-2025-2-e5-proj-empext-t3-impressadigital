// components/layout/relatedProducts.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface RelatedProduct {
    id: number;
    nome: string;
    slug: string; // Essencial para o link
    preco: number;
    categoria_id: number; // Essencial para a busca
    midias?: Array<{
        id: number;
        url: string;
    }>;
}

interface MainProductInfo {
    id: number;
    categoria: {
        id: number;
    }
}

interface RelatedProductsProps {
    // Recebe o slug
    productIdentifier: string | string[] | undefined; 
}

export default function RelatedProducts({ productIdentifier }: RelatedProductsProps) {
    const [products, setProducts] = useState<RelatedProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        if (!productIdentifier) {
            setError("Identificador do produto não fornecido.");
            setLoading(false);
            return;
        }
        
        const slug = Array.isArray(productIdentifier) ? productIdentifier[0] : productIdentifier;


        const fetchRelatedProducts = async () => {
            try {
                // 1. Buscar o produto principal pelo SLUG para obter o ID da Categoria
                const mainProductRes = await fetch(`http://localhost:3000/products/slug/${slug}`);
                if (!mainProductRes.ok) throw new Error("Erro ao buscar o produto principal.");
                const mainProduct = (await mainProductRes.json()) as MainProductInfo;
                
                const categoryId = mainProduct.categoria.id;

                // 2. Buscar produtos relacionados, usando a CATEGORIA_ID para o filtro no backend
                const relatedRes = await fetch(`http://localhost:3000/products?categoria_id=${categoryId}`);
                if (!relatedRes.ok) throw new Error("Erro ao buscar produtos relacionados.");
                const allRelatedProducts = (await relatedRes.json()) as RelatedProduct[];

                // 3. Filtrar para não incluir o produto que já está na tela
                const filteredProducts = allRelatedProducts.filter(p => p.id !== mainProduct.id);

                setProducts(filteredProducts);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro desconhecido ao carregar produtos relacionados.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [productIdentifier]); // O useEffect re-executa sempre que o slug muda

    if (loading) return <div>Carregando produtos relacionados...</div>;
    if (error) return <div className="text-red-500">Erro: {error}</div>;
    if (products.length === 0) return <div>Nenhum produto relacionado encontrado.</div>;
    
    return (
        <section className="p-6 mt-10">
            <h2 className="text-2xl text-[#A1A1A1] text-center font-bold mb-4">Produtos Relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {products.map((p) => (
                    // CRÍTICO: O link deve apontar para o novo caminho com o slug
                    <Link key={p.id} href={`/product/${p.slug}`}>
                        <div className="flex flex-col bg-[#F3F3F3] rounded-lg p-2 shadow-sm">
                            <div className="flex items-center px-2 py-2 bg-white rounded-lg">
                                <Image
                                    width={100}
                                    height={100}
                                    src={p.midias?.[0]?.url || "/images/placeholder.png"}
                                    alt={p.nome}
                                    className="rounded w-full"
                                />
                            </div>
                            <p className="text-sm mt-2">{p.nome}</p>
                            <button className="bg-[#35b814] text-white px-5 py-1 rounded-2xl text-sm mt-2 self-center">
                                Ver opções
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}