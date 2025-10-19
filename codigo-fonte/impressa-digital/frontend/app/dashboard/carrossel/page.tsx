// app/produtos/[slug]/page.tsx
'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const closeModal = () => {
    setIsOpen(false);
    router.push(`/app/produtos/[slug]`);
  };

  const handleImageAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleSave = () => {
    setSuccessMessage('Carrossel adicionado com sucesso!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-11/12 max-w-2xl p-6 rounded-2xl shadow-lg text-center relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Gerenciar Imagens do Carrossel
        </h2>

        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="mb-4 text-green-600 font-medium bg-green-100 border border-green-300 p-2 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Botões */}
        <div className="mb-6">
          <label
            htmlFor="upload"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer mr-2"
          >
            Adicionar
          </label>
          <input
            id="upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageAdd}
            className="hidden"
          />

          {/* Botão de salvar só aparece se houver pelo menos 1 imagem */}
          {images.length > 0 && (
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Salvar
            </button>
          )}
        </div>

        {/* Lista de imagens */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative bg-gray-100 p-2 rounded-lg shadow"
              >
                <img
                  src={img}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-sm px-2 py-1 rounded-lg"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhuma imagem adicionada ainda.</p>
        )}

        <button
          onClick={closeModal}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
