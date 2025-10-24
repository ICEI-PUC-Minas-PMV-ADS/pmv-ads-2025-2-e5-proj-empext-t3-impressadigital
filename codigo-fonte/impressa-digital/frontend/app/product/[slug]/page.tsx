// app/produtos/[slug]/page.tsx
'use client'

import React, { useState, useCallback } from 'react'; // Adicionar useState e useCallback
import { useParams } from 'next/navigation'; 
import HeaderMain from '../../components/layout/headerMain';
import ProductDetails from '../../components/layout/productDetail';
import RelatedProducts from '../../components/layout/relatedProducts';
import CustomerReviews from '../../components/layout/customerReviews';

export default function Product() {
    // useParams() retorna o nome da pasta dinâmica, que é 'slug'
    const params = useParams();
    
    // Garantimos que o identificador seja uma string simples (o slug)
    const productSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug; 

    // 1. Novo estado para rastrear se o produto está ativo/disponível. 
    // Começa como 'true' para evitar piscar ao carregar.
    const [isActive, setIsActive] = useState<boolean>(true); 

    // 2. Callback para ser passado ao ProductDetails e atualizar o estado
    const handleProductStatusChange = useCallback((status: boolean) => {
        setIsActive(status);
    }, []);

    return (
        <div>
            <HeaderMain />
            
            <div className='flex-col px-10 ' key={productSlug}> 
                <div className=' w-full '>
                    {/* 3. Renderiza ProductDetails para iniciar a busca e notificar o status */}
                    <ProductDetails 
                        productIdentifier={productSlug} 
                        onProductStatusChange={handleProductStatusChange} // Passa o callback
                    />
                </div>
            </div>
            
            {/* 4. Renderização Condicional: Só renderiza o restante do conteúdo se o produto estiver ativo */}
            {isActive ? (
                <>
                    <RelatedProducts productIdentifier={productSlug} />
                
                    <div className='flex-col px-10 md:px-20 pt-10 mt-10 bg-gray-100 ' key={`reviews-${productSlug}`} > 
                        <h2 className="text-2xl text-[#A1A1A1] text-center font-bold mb-4">Avaliações de clientes</h2>
                        <CustomerReviews productIdentifier={productSlug} />
                    </div>
                </>
            ) : null}
        </div>
    )
}