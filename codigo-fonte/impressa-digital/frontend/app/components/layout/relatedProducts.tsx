// components/layout/relatedProducts.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

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
                const mainProductRes = await fetch(`http://localhost:3000/products/slug/${slug}`);
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
                let relatedRes = await fetch(`http://localhost:3000/products?categoria_id=${categoryId}`);
                let relatedData: RelatedProduct[] = await relatedRes.json();
                
                // 3. Filtra produtos inativos e o produto principal
                let filteredCategoryProducts = relatedData
                    .filter(p => p.id !== mainProduct.id) // Exclui o produto principal
                    .filter(p => p.status === 'ativo'); // **FILTRO DE STATUS INATIVO**
                
                // 4. Lógica de Fallback
                if (filteredCategoryProducts.length === 0) { // Se não encontrou NENHUM na mesma categoria
                    // Busca TODOS os produtos ativos (fallback)
                    const fallbackRes = await fetch(`http://localhost:3000/products?status=ativo`);
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
        <section className="p-6 mt-10 relative">
            <h2 className="text-2xl text-[#A1A1A1] text-center font-bold mb-4">Produtos Relacionados</h2>
            
            <div className="relative flex items-center  justify-center">
                {/* Seta para a Esquerda */}
                {showCarousel && !isAtStart && (
                    <button 
                        onClick={() => scrollCarousel('left')} 
                        className="  p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 transition translate-x-1/2"
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
                            // flex-shrink-0: Garante que o item não encolha. 
                            // w-1/5: Garante que 5 itens caibam na tela (100% / 5).
                            className="flex-shrink-0 w-2/5 md:w-1/5 snap-start" 
                        >
                            <div className="flex flex-col bg-[#F3F3F3] rounded-lg p-2 shadow-sm h-full">
                                <div className="flex items-center justify-center px-2 py-2  rounded-lg h-32">
                                    <Image
                                        width={150}
                                        height={150}
                                        src={p.midias?.[0]?.url || "/images/placeholder.png"}
                                        alt={p.nome}
                                        className="rounded max-h-full object-contain"
                                    />
                                </div>
                                <p className="text-sm mt-2 flex-grow">{p.nome}</p>
                                <button className="bg-[#35b814] text-white px-5 py-1 rounded-2xl text-sm mt-2 self-center w-full">
                                    Ver opções
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Seta para a Direita */}
                {showCarousel && !isAtEnd && (
                    <button 
                        onClick={() => scrollCarousel('right')} 
                        className=" p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 transition -translate-x-1/2"
                        aria-label="Rolar para a direita"
                    >
                        &gt;
                    </button>
                )}
            </div>
        </section>
    );
}