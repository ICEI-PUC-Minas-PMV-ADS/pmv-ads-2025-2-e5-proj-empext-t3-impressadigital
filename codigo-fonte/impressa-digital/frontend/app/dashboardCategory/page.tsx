"use client";

import React, { useState, useEffect } from "react";

import HeaderDashboard from "../components/layout/headerDashboard";
import SidebarDashboard from "../components/layout/sidebarDashboard";

const DashboardCategory: React.FC = () => {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      URL.revokeObjectURL(removed); // libera a URL removida
      return updated;
    });
  };

  // limpa URLs quando o componente desmontar
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeaderDashboard />
      <div className="flex flex-1">
        <SidebarDashboard />
        <main className="flex-1 p-6 font-sans mt-8">
          <p className="text-black text-4xl font-bold mb-6">Categoria</p>

          <div className="border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-black font-sans font-bold mb-4 text-2xl">
              Adicionar produto
            </p>

            <form className="flex flex-col gap-4 text-black font-sans">
              {/* Categoria */}
              <input
                type="text"
                placeholder="Selecione a categoria"
                className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
              />

              {/* Nome do produto */}
              <input
                type="text"
                placeholder="Nome do produto"
                className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
              />

              {/* Upload de fotos */}
              <div className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus-within:ring-1 focus-within:ring-[#45A62D]">
                <label
                  htmlFor="fileUpload"
                  className="px-4 py-2 rounded-2xl bg-[#45A62D] text-white font-semibold cursor-pointer w-fit"
                >
                  Escolher imagens
                </label>
                <input
                  id="fileUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Preview das imagens */}
                {previews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Pré-visualizações:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {previews.map((src, index) => (
                        <div key={index} className="relative w-32 h-32 group">
                          <img
                            src={src}
                            alt={`Pré-visualização ${index + 1}`}
                            className="w-32 h-32 object-cover rounded-2xl border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-[#45A62D] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 transition cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Descrição */}
              <textarea
                placeholder="Descrição"
                className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
                rows={4}
              />

              {/* Valor */}
              <input
                type="text"
                inputMode="decimal"
                placeholder="Valor"
                className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/[^0-9.,]/g, "");
                  target.value = target.value
                    .replace(/,/g, ".")
                    .replace(/(\..*)\./g, "$1");
                }}
              />

              <button
                type="submit"
                className="mt-4 px-6 py-2 bg-[#45A62D] text-white font-semibold rounded-2xl transition w-50 cursor-pointer"
              >
                Salvar produto
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardCategory;
