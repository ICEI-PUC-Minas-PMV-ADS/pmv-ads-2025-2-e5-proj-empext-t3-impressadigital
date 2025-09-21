'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import HeaderMain from '../components/layout/headerMain';
import ProductDetails from '../components/layout/productDetail';
import RelatedProducts from '../components/layout/relatedProducts';
import CustomerReviews from '../components/layout/customerReviews';


export default function Product() {
    const pathname = usePathname();
    return (
        <div>
        <HeaderMain />
        <div className='flex-col px-20'>
                <div className=' w-full '>
                    <ProductDetails />
                </div>
            
            <RelatedProducts />
            
        </div>
        <div className='flex-col px-20 pt-10 mt-10 bg-gray-100 ' >
                <h2 className="text-2xl text-[#A1A1A1] text-center font-bold mb-4">Avaliações de clientes</h2>
                <CustomerReviews />
        </div>
</div>
    )
}