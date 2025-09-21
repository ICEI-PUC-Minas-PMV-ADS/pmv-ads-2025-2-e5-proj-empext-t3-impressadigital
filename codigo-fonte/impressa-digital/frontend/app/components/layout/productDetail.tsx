"use client";

import React from "react";
import Image from "next/image";
export default function ProductDetails() {
  return (
    <section className="p-10 bg-white shadow rounded-lg">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Imagem */}
        <div className="flex justify-center py-5 w-full md:w-1/3 bg-[#F3F3F3] rounded-lg">
        <div className=" flex items-center px-2 bg-white rounded-lg">
          <Image
                      src="/images/cvtAlicePaisMaravilhas.png"
                      width={300}
                      height={300}
            alt="Produto exemplo"
            className="rounded-lg shadow"
            />
            </div>
        </div>

        {/* Informações */}
        <div className=" w-full md:w-2/3 flex flex-col">
          <h1 className="text-2xl font-bold">
            Convite de aniversário Alice no País das Maravilhas
          </h1>
          <span className="text-black-600 font-bold mt-2 px-4 py-1 rounded-2xl w-fit" style={{ background: "#3DF034" }} >PERSONALIZADO</span>
          <p className=" text-[32px] font-sans font-[inter] font-bold mt-2">R$ 32,00</p>

          <input
            type="text"
            placeholder="Escreva nome e idade"
            className="bg-[#e6e6e6] color-[#6B6B6B] font-[inter]-bold text-lg pl-4 
            rounded-2xl p-2 w-2/3 mt-4 focus:outline-[#3DF034]" 
          />

          <button className=" text-[#000] font-bold px-4 py-2 rounded mt-4 w-fit">
           Adicionar ao carrinho
                  </button>
                  
          <p className="mt-4 text-gray-700">
            Kits de Decoração de Aniversário – Entre na magia do País das
            Maravilhas! Convite de aniversário Alice no País das MaravilhasConvite de aniversário Alice no País das Maravilhas
            
          </p> 
        </div>
      </div>
    </section>
  );
}
