"use client";

import React from "react";
import Link from "next/link"; 
import Image from "next/image";
import HeaderMain from "../components/layout/headerMain"; 

export default function ContatoPage() {
  return (
    <div>

      <HeaderMain />

      <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-10 mt-15 mb-30">
  
        <div className="flex flex-col gap-5 text-justify w-full md:w-1/2 pr-10 md:mx-0 ml-10">
          <h2 className="text-3xl font-bold mb-3 text-[#2c2a2a]">
            Contato
          </h2>
         
          <div className="bg-gray-100 p-6 rounded-lg space-y-4 text-black text-left">
            <h3 className="text-xl font-semibold text-[#2c2a2a]">Impressa Digital</h3>
            <p className="text-gray-700">📧 contato@impressadigital.com.br</p>
            <p className="text-gray-700">📱 (31) 9 9140-7186</p>
          </div>
        </div>

        {/* Mascote / calango - Estrutura de imagem */}
        <Image
          src="/images/contato.png"
          alt="Mascote da Impressa Digital"
          width={300} 
          height={300} 
          className="object-contain mt-15"
        />
      </div>

    </div>
  );
}