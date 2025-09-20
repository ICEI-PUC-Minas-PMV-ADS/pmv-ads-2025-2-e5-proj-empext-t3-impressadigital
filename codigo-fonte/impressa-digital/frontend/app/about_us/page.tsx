"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import HeaderMain from "../components/layout/headerMain";
import GeneralReviews from "../components/layout/generalReviews";

export default function AboutUs() {
  return (
    <div>
      <HeaderMain />
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-10 mt-15 mb-30">
        <div className="flex flex-col gap-5 text-justify w-full md:w-1/2 pr-10 md:mx-0 ml-10">
          <h2 className="text-3xl font-bold mb-3 text-[#2c2a2a]">Sobre nós</h2>
          <p >
            A Gráfica Impressa nasceu no início da pandemia, em um momento de
            desafios e transformações. O que começou como uma solução gráfica
            para atender às necessidades urgentes daquele período, tornou-se um
            sonho que hoje completa 5 anos de história.
          </p>
          <p>
            Desde o primeiro dia, nosso compromisso foi oferecer qualidade,
            criatividade e dedicação em cada projeto. Ao longo desse tempo,
            crescemos, nos reinventamos e conquistamos a confiança de nossos
            clientes, sempre buscando entregar mais do que produtos:
            experiências.
          </p>
          <p>
            Agora, estamos prontos para expandir nossos horizontes. Mantendo
            nossa essência no ramo gráfico, damos um novo passo em direção ao
            universo das festas e personalizados, trazendo ainda mais cor,
            alegria e originalidade para os momentos especiais da sua vida.
          </p>
          <p>
            Seja para celebrar, criar memórias inesquecíveis ou transformar uma
            ideia em realidade, a Gráfica Impressa está aqui para transformar
            cada detalhe em algo único.
          </p>
        </div>
        <Image
          src="/images/sobreNos.png"
          alt="Sobre Nós"
          width={300}
          height={300}
          className="object-contain mt-15"
        />
      </div>
      <div className="flex-col px-20 pt-10 mt-10 bg-gray-100 ">
        <h2 className="text-3xl text-[#A1A1A1] text-center font-bold mb-4">Avaliação geral</h2>
        <GeneralReviews />
      </div>
      
    </div>
  );
}
