// app/produtos/[slug]/page.tsx
'use client'

import React from 'react';
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

    return (
        <div>
            <HeaderMain />
            
            {/* O uso do 'key' com o slug é o que força o React/Next.js a 
               descartar o componente anterior e montar um novo, 
               disparando um novo 'useEffect' para buscar os dados. */}
            <div className='flex-col px-20' key={productSlug}> 
                <div className=' w-full '>
                    <ProductDetails productIdentifier={productSlug} />
                </div>
                <RelatedProducts productIdentifier={productSlug} />
            </div>
            
            <div className='flex-col px-20 pt-10 mt-10 bg-gray-100 ' key={`reviews-${productSlug}`} > 
                <h2 className="text-2xl text-[#A1A1A1] text-center font-bold mb-4">Avaliações de clientes</h2>
                <CustomerReviews productIdentifier={productSlug} />
            </div>
        </div>
    )
}