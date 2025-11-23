// components/layout/relatedProducts.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { div } from "framer-motion/client";

interface RelatedProduct {
    id: number;
    nome: string;
    slug: string; // Essencial para o link
    preco: number;
    categoria_id?: number; // Pode não vir na busca por slug
    status?: string; // CRÍTICO: Adicionado para o filtro
    midias?: Array<{
        id: number;
        url: string;
    }>;
}

interface MainProductInfo {
    id: number;
    status: string; // CRÍTICO: Adicionado para verificar inativo
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

    // Novo estado e ref para o carrossel
    const [currentIndex, setCurrentIndex] = useState(0);
    const productsContainerRef = useRef<HTMLDivElement>(null);

    // Função para rolar o carrossel (avança de 5 em 5)
    const scrollCarousel = (direction: 'left' | 'right') => {
        if (productsContainerRef.current) {
            const container = productsContainerRef.current;
            // Largura do item (calculado com base em 5 itens visíveis)
            const itemWidth = container.scrollWidth / products.length;
            const scrollDistance = itemWidth * 5; // Rola 5 itens

            if (direction === 'right') {
                container.scrollBy({ left: scrollDistance, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
            }

            // Atualiza o índice para controle visual das setas
            setTimeout(() => {
                const newScrollLeft = container.scrollLeft;
                const newIndex = Math.round(newScrollLeft / itemWidth);
                setCurrentIndex(newIndex);
            }, 300); // Pequeno delay para sincronizar com a animação scroll
        }
    };


    useEffect(() => {
        setLoading(true);
        setError(null);
        setProducts([]);

        if (!productIdentifier) {
            setError("Identificador do produto não fornecido.");
            setLoading(false);
            return;
        }

        const slug = Array.isArray(productIdentifier) ? productIdentifier[0] : productIdentifier;


        const fetchRelatedProducts = async () => {
            try {
                // 1. Busca o produto principal para obter Categoria ID e Status
                const mainProductRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/slug/${slug}`);
                if (!mainProductRes.ok) throw new Error("Erro ao buscar o produto principal.");

                const mainProduct = (await mainProductRes.json()) as MainProductInfo;

                // CRÍTICO: Se o produto principal estiver inativo, para a busca de relacionados.
                if (mainProduct.status === "inativo") {
                    setError("Produto principal inativo. Não buscando recomendações.");
                    setLoading(false);
                    return;
                }

                const categoryId = mainProduct.categoria.id;
                let finalProducts: RelatedProduct[] = [];

                // 2. Tenta buscar produtos da MESMA categoria
                let relatedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?categoria_id=${categoryId}`);
                let relatedData: RelatedProduct[] = await relatedRes.json();

                // 3. Filtra produtos inativos e o produto principal
                let filteredCategoryProducts = relatedData
                    .filter(p => p.id !== mainProduct.id) // Exclui o produto principal
                    .filter(p => p.status === 'ativo'); // **FILTRO DE STATUS INATIVO**

                // 4. Lógica de Fallback
                if (filteredCategoryProducts.length === 0) { // Se não encontrou NENHUM na mesma categoria
                    // Busca TODOS os produtos ativos (fallback)
                    const fallbackRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?status=ativo`);
                    const fallbackData: RelatedProduct[] = await fallbackRes.json();

                    finalProducts = fallbackData
                        .filter(p => p.id !== mainProduct.id) // Exclui o produto principal
                        .slice(0, 10); // Limita a 10 para não sobrecarregar a tela (carrossel)
                } else {
                    finalProducts = filteredCategoryProducts;
                }

                setProducts(finalProducts);

            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro desconhecido ao carregar produtos relacionados.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [productIdentifier]);

    // Renderização
    if (loading) return <div>Carregando produtos relacionados...</div>;
    // Não mostra erro, mostra apenas que não há produtos relacionados, conforme boas práticas de UX
    if (error || products.length === 0) return (
        <section className="p-6 mt-10">
            <h2 className="text-2xl text-[#A1A1A1] text-center font-bold mb-4">Produtos Relacionados</h2>
            <div className="text-center text-gray-500 py-10">
                {error ? "Não foi possível carregar as recomendações." : "Nenhum produto relacionado disponível no momento."}
            </div>
        </section>
    );

    // Variáveis de Carrossel
    const itemsPerView = 5;
    const showCarousel = products.length > itemsPerView;
    const isAtStart = productsContainerRef.current ? productsContainerRef.current.scrollLeft === 0 : true;
    const isAtEnd = productsContainerRef.current ?
        productsContainerRef.current.scrollLeft >= productsContainerRef.current.scrollWidth - productsContainerRef.current.offsetWidth - 1 :
        products.length <= itemsPerView;

    return (
        <div className="flex-1 py-6 w-full bg-[#F9FAFB] rounded-x100 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden p-6 mt-10" >
            <section className="p-6 mt-10 relative">
                <h2 className="text-2xl text-[#A1A1A1] text-center font-bold mb-4">Produtos Relacionados</h2>

                <div className="relative flex items-center justify-center">
                    {/* Seta para a Esquerda */}
                    {showCarousel && !isAtStart && (
                        <button
                            onClick={() => scrollCarousel('left')}
                            className=" absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 transition -translate-x-1/2"
                            aria-label="Rolar para a esquerda"
                        >
                            &lt;
                        </button>
                    )}

                    {/* Container dos Produtos - Habilita rolagem horizontal */}
                    <div
                        ref={productsContainerRef}
                        // Oculta a barra de rolagem nativa, permite rolagem forçada por setas
                        className="flex overflow-x-auto w-full space-x-4 p-2 scrollbar-hide snap-x snap-mandatory"
                        // Se for menor ou igual a 5, o overflow fica 'hidden' para não permitir a rolagem
                        style={{ overflowX: showCarousel ? 'scroll' : 'hidden' }}
                    >
                        {products.map((p) => (
                            <Link
                                key={p.id}
                                href={`/product/${p.slug}`}
                                // CLASSES DE ESTILIZAÇÃO (CARTÃO POLAROID + EFEITO 3D/ESCALA)
                                className="
                            flex-shrink-0 w-2/5 md:w-1/5 snap-start 
                            bg-white p-2 rounded-lg shadow-md transition 
                            transform hover:shadow-xl hover:-translate-y-1 **hover:scale-105** flex flex-col overflow-hidden relative
                        "
                                style={{ minHeight: '250px' }} // Altura mínima adaptada para o carrossel
                            >
                                <div className="flex flex-col h-full">
                                    {/* CONTAINER DA IMAGEM: Garante o formato quadrado (aspect-square) e centralização */}
                                    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden rounded-md">
                                        <Image
                                            width={150} // Reduced width
                                            height={150} // Reduced height to match width for square
                                            src={p.midias?.[0]?.url || "/images/placeholder.png"}
                                            alt={p.nome}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* CONTAINER DO NOME */}
                                    <div className="p-1 text-center flex flex-col flex-1 justify-center">
                                        <h1 className="font-semibold text-gray-800 text-sm line-clamp-2">
                                            {p.nome}
                                        </h1>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Seta para a Direita */}
                    {showCarousel && !isAtEnd && (
                        <button
                            onClick={() => scrollCarousel('right')}
                            className=" absolute right-0 z-10 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 transition translate-x-1/2"
                            aria-label="Rolar para a direita"
                        >
                            &gt;
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
}