"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeaderMain() {
  return (
    <header className="w-full ">
      {/* Topo */}
      <div className="flex items-center justify-between px-6 md:px-20 py-3">
        {/* Logo */}
        <Link href="/">
          <Image
            src={"/images/logo_impressa_digital.png"}
            alt="Logo impressa digital"
            width={140}
            height={140}
            className="object-contain "
          />
        </Link>

        {/* Barra de pesquisa */}
        <div className="relative flex w-full max-w-xl mx-6">
          <input
            className="w-full rounded-full border border-gray-300 bg-gray-100 px-2 py-3 pl-5 text-sm placeholder-gray-500  focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            type="search"
            placeholder="Procure produtos aqui..."
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
            type="submit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22"
              viewBox="0 -960 960 960"
              width="22"
              fill="currentColor"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 
                        75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 
                        252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 
                        0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </button>
        </div>

        {/* Login */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
          <div className="flex items-center justify-center rounded-full bg-gray-200 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              fill="#555"
            >
              <path d="M480-480q-66 0-113-47t-47-113q0-66 
                      47-113t113-47q66 0 113 47t47 113q0 
                      66-47 113t-113 47ZM160-160v-112q0-34 
                      17.5-62.5T224-378q62-31 126-46.5T480-440q66 
                      0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">Iniciar sessão</p>
        </div>
      </div>

      {/* Menu verde */}
      <div className="flex w-full items-center justify-center gap-6 py-3">
        <ul className="flex flex-wrap gap-3">
          {[
            "Temas infantis",
            "Casamento",
            "Formatura",
            "Tempo de entrega",
            "Sobre nós",
            "Contato",
          ].map((item, index) => (
            <li
              key={index}
                  className="bg-[#2ab906] rounded-full px-8 py-2
               text-white uppercase text-sm font-bold cursor-pointer
                hover:bg-green-600 transition"
            >
              {item}
            </li>
          ))}
        </ul>

        {/* WhatsApp */}
        <div className="ml-4">
          <Image
            src={"/images/iconWhatsapp.png"}
            alt="Icone whatsapp"
            width={80}
                      height={80}
                      className="object-contain"
          />
        </div>
      </div>
    </header>
  );
}
