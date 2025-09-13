"use client";

import React from "react";
import Image from "next/image";

export default function RelatedProducts() {
  const products = Array(5).fill({
    name: "Convite Alice no País das Maravilhas",
    img: "/images/cvtAlicePaisMaravilhas.png",
  });

  return (
    <section className="p-6 mt-10">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {products.map((p, i) => (
            <div key={i} className="flex flex-col bg-[#F3F3F3] rounded-lg p-2 shadow-sm">
                <div className=" flex items-center px-2 py-2 bg-white rounded-lg">
                <Image
                    width={100}
                    height={100}
                    src={p.img}
                    alt={p.name}
                        className="rounded w-full" />
                </div>
            <p className="text-sm mt-2">{p.name}</p>
                <button className="bg-[#35b814] text-white px-5 py-1 rounded-2xl 
                text-sm mt-2 self-center ">
              Ver opções
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
