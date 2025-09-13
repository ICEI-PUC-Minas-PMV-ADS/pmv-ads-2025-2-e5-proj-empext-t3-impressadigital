"use client";

import React, { useState } from "react";
import HeaderDashboard from "../components/layout/headerDashboard";
import SidebarDashboard from "../components/layout/sidebarDashboard";
import Link from "next/link";

interface Product {
  id: number;
  image: string;
  name: string;
  category: string;
  price: string;
  status: string;
}

const DashboardProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      image: "/images/cvtAlicePaisMaravilhas.png",
      name: "Convite Alice",
      category: "Eventos",
      price: "R$ 79,90",
      status: "Ativo",
    },
    {
      id: 2,
      image: "/images/cvtAlicePaisMaravilhas.png",
      name: "Convite Marvel",
      category: "Eventos",
      price: "R$ 249,90",
      status: "Ativo",
    },
    {
      id: 3,
      image: "/images/cvtAlicePaisMaravilhas.png",
      name: "Convite DC",
      category: "Eventos",
      price: "R$ 199,90",
      status: "Inativo",
    },
  ]);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <HeaderDashboard />
      <div className="flex flex-1">
        <SidebarDashboard />
        <main className="flex-1 p-4 lg:p-6 font-sans mt-8">
          <p className="text-black text-3xl lg:text-4xl font-bold">Produtos</p>

          <Link href="/dashboardCategory" passHref>
            <button
              className="text-base font-sans font-extrabold text-white mt-4 px-4 py-2 bg-[#45A62D] 
                           rounded-2xl h-13 w-full md:w-60 cursor-pointer transform transition-all duration-200 
                           hover:scale-101"
            >
              + ADICIONAR PRODUTO
            </button>
          </Link>

          <div className="mt-8 w-full text-black">
            {/* Cabeçalho - Desktop */}
            <div className="bg-white rounded-lg shadow p-4 items-center font-semibold hidden md:flex">
              <div className="flex items-center gap-4 w-2/5">Nome / Imagem</div>
              <div className="w-1/5">Categoria</div>
              <div className="w-1/6">Preço</div>
              <div className="w-1/6">Status</div>
              <div className="flex justify-end gap-3 w-1/12">Ações</div>
            </div>

            {/* Lista de produtos */}
            <ul className="space-y-4 mt-2">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  {/* Desktop layout */}
                  <div className="hidden md:flex w-full items-center justify-between">
                    <div className="flex items-center gap-4 w-2/5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="font-semibold">{product.name}</span>
                    </div>
                    <div className="w-1/5">{product.category}</div>
                    <div className="w-1/6">{product.price}</div>
                    <div className="w-1/6">{product.status}</div>
                    <div className="flex justify-end gap-3 w-1/12">
                      <button className="hover:scale-110 transition-transform">
                        <img
                          src="/images/edit_icon.png"
                          alt="Editar"
                          className="w-6 h-6"
                        />
                      </button>
                      <button className="hover:scale-110 transition-transform">
                        <img
                          src="/images/delete_icon.png"
                          alt="Excluir"
                          className="w-6 h-6"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Mobile layout */}
                  <div className="flex flex-col md:hidden">
                    <div className="flex justify-between">
                      <div className="flex flex-col flex-1 gap-7">
                        <div className="flex gap-x-1">
                          <span className="font-semibold">Nome:</span>
                          <span>{product.name}</span>
                        </div>
                        <div className="flex gap-x-1">
                          <span className="font-semibold">Categoria:</span>
                          <span>{product.category}</span>
                        </div>
                        <div className="flex gap-x-1">
                          <span className="font-semibold">Preço:</span>
                          <span>{product.price}</span>
                        </div>
                      </div>

                      <div className="w-24 h-24 flex-shrink-0 ml-4 md:w-36 md:h-36">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    </div>

                    {/* Status e Ações */}
                    <div className="flex justify-between mt-2 items-center">
                      <div>
                        <span className="font-semibold">Status:</span>{" "}
                        {product.status}
                      </div>
                      <div className="flex gap-2">
                        <button className="hover:scale-110 transition-transform">
                          <img
                            src="/images/edit_icon.png"
                            alt="Editar"
                            className="w-6 h-6"
                          />
                        </button>
                        <button className="hover:scale-110 transition-transform">
                          <img
                            src="/images/delete_icon.png"
                            alt="Excluir"
                            className="w-6 h-6"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {products.length === 0 && (
            <p className="mt-4 text-gray-500">
              Nenhum produto cadastrado ainda.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardProducts;
