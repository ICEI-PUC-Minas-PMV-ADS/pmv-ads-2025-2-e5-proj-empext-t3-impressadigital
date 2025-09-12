'use client';

import React, { useEffect, useState } from 'react';
import HeaderDashboard from '../components/layout/header_dashboard';
import SidebarDashboard from '../components/layout/sidebar_dashboard';

interface Product {
  id: number;
  image: string;
  name: string;
  category: string;
  price: string;
  status: string;
}

const DashboardProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      // Preparar para receber a API
      const res = await fetch('/api/products');
      const data: Product[] = await res.json();
      setProducts(data);
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 flex flex-col">
      <HeaderDashboard />
      <div className="flex flex-1">
        <SidebarDashboard />
        <main className="flex-1 p-6 font-sans mt-8">
          <p className="text-black text-4xl font-bold">Produtos</p>

          <button className="text-base font-sans font-extrabold text-white mt-4 px-4 py-2 bg-[#45A62D] 
                             rounded-2xl h-13 w-60 cursor-pointer transform transition-all duration-200 hover:scale-101">
            + ADICIONAR PRODUTO
          </button>

          <div className="mt-8 overflow-x-auto w-[95%]">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="text-left text-black font-sans font-light">
                  <th className="px-8 py-4">Imagem</th>
                  <th className="px-8 py-4">Nome</th>
                  <th className="px-8 py-4">Categoria</th>
                  <th className="px-8 py-4">Preço</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    </td>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.category}</td>
                    <td className="px-4 py-2">{product.price}</td>
                    <td className="px-4 py-2">{product.status}</td>
                    <td className="px-4 py-2 flex gap-2 items-center">
                      <img
                        src="/images/edit_icon.png"   
                        alt="Editar"
                        className="w-6 h-6 cursor-pointer hover:scale-102 transition-transform"
                      />
                      <img
                        src="/images/delete_icon.png" 
                        alt="Excluir"
                        className="w-6 h-6 cursor-pointer hover:scale-102 transition-transform"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <p className="mt-4 text-gray-500">Nenhum produto cadastrado ainda.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardProducts;
