// components/layout/customerReviews.tsx
"use client";

import React, { useEffect, useState } from "react";

interface Review {
    id: number;
    user: string;
    text: string;
    stars: number;
}

interface ProductInfo {
    id: number;
    // Outras propriedades não são relevantes para este fetch
}

interface CustomerReviewsProps {
    productIdentifier: string | string[] | undefined;
}

export default function CustomerReviews({ productIdentifier }: CustomerReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!productIdentifier) {
            setError("Identificador do produto não fornecido.");
            setLoading(false);
            return;
        }

        const slug = Array.isArray(productIdentifier) ? productIdentifier[0] : productIdentifier;

        const fetchReviews = async () => {
            try {
                setLoading(true);

                // 1. Buscar o produto principal pelo SLUG para obter o ID
                const mainProductRes = await fetch(`http://localhost:3000/products/slug/${slug}`);
                if (!mainProductRes.ok) throw new Error("Erro ao buscar informações do produto principal.");
                const mainProduct = (await mainProductRes.json()) as ProductInfo;
                const productId = mainProduct.id;
                
                // 2. Usar o ID retornado para buscar as avaliações
                const res = await fetch(`http://localhost:3000/reviews?productId=${productId}`);
                if (!res.ok) throw new Error("Erro ao buscar avaliações.");
                const data = (await res.json()) as Review[];
                setReviews(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro desconhecido");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productIdentifier]);

    if (loading) return <div>Carregando avaliações...</div>;
    if (error) return <div className="text-red-500">Erro: {error}</div>;
    if (reviews.length === 0) return <div>Ainda não há avaliações para este produto.</div>;

    return (
        <section className="p-6 ">
            {reviews.map((r) => (
                <div key={r.id} className="border rounded-lg p-4 mb-4 bg-white shadow">
                    <p className="font-semibold">{r.user}</p>
                    <p className="text-[#45A62D] text-xl">
                        {"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}
                    </p>
                    <p className="text-gray-700 mt-2">{r.text}</p>
                </div>
            ))}
            <button className="text-gray-600 hover:underline text-center">Ver mais</button>
        </section>
    );
}