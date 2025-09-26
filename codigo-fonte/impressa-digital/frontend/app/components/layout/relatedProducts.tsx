// components/layout/relatedProducts.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
    id: number;
    nome: string;
    preco: number;
    categoria_id: number;
    midias?: Array<{
        id: number;
        url: string;
    }>;
}

interface RelatedProductsProps {
    productId: string | string[] | undefined;
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!productId) {
            setError("ID do produto não fornecido.");
            setLoading(false);
            return;
        }

        const fetchRelatedProducts = async () => {
            try {
                setLoading(true);
                // 1. Buscar o produto principal para obter a categoria
                const mainProductRes = await fetch(`http://localhost:3000/products/${productId}`);
                if (!mainProductRes.ok) throw new Error("Erro ao buscar o produto principal.");
                const mainProduct = (await mainProductRes.json()) as Product;

                // 2. Buscar todos os produtos da mesma categoria
                const relatedRes = await fetch(`http://localhost:3000/products?categoria_id=${mainProduct.categoria_id}`);
                if (!relatedRes.ok) throw new Error("Erro ao buscar produtos relacionados.");
                const allRelatedProducts = (await relatedRes.json()) as Product[];

                // 3. Filtrar para não incluir o produto principal
                const filteredProducts = allRelatedProducts.filter(p => p.id !== mainProduct.id);

                setProducts(filteredProducts);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro desconhecido");
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [productId]);

    if (loading) return <div>Carregando produtos relacionados...</div>;
    if (error) return <div className="text-red-500">Erro: {error}</div>;
    if (products.length === 0) return <div>Nenhum produto relacionado encontrado.</div>;
    
    return (
        <section className="p-6 mt-10">
            <h2 className="text-2xl text-[#A1A1A1] text-center font-bold mb-4">Produtos Relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {products.map((p) => (
                    <Link key={p.id} href={`/product/${p.id}`}>
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