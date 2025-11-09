"use client";

import React, { useState } from "react";

interface OrderCardProps {
  date: string;
  title: string;
  description: string;
  quantity: number;
  productImage: string;
  total?: number;
  status?: string;
  productId?: number;
}

const OrderCard: React.FC<OrderCardProps> = ({
  date,
  title,
  description,
  quantity,
  productImage,
  total,
  status = "pendente",
  productId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Pré-visualização das imagens
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setFiles((prev) => [...prev, ...newFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Envio da avaliação
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productId) {
      alert("ID do produto não encontrado.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    try {
      setLoading(true);

      const payload = {
        avaliacoes: formData.get("description"),
        rating,
        produto: { id: productId },
      };

      const reviewRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/avaliacoes_produto`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!reviewRes.ok) throw new Error("Erro ao criar avaliação.");
      const newReview = await reviewRes.json();

      // Faz upload das imagens
      if (files.length > 0) {
        const formDataUpload = new FormData();
        files.forEach((file) => formDataUpload.append("files", file));

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/midias/avaliacoes/${newReview.id}/upload`,
          {
            method: "POST",
            body: formDataUpload,
          }
        );

        if (!uploadRes.ok) throw new Error("Erro ao enviar imagens.");
      }

      alert("✅ Avaliação enviada com sucesso!");

      // Reset do formulário e fechamento
      setIsOpen(false);
      setFiles([]);
      setPreviews([]);
      setRating(0);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar avaliação.");
    } finally {
      setLoading(false);
    }
  };

  // Cores e textos do status
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "confirmado":
        return "bg-green-100 text-green-700 border border-green-300";
      case "cancelado":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    }
  };

  const getStatusText = () => {
    switch (status.toLowerCase()) {
      case "confirmado":
        return "Confirmado";
      case "cancelado":
        return "Cancelado";
      default:
        return "Pendente";
    }
  };

  const isAvaliable = status.toLowerCase() === "confirmado";

  return (
    <div className="bg-white w-[75%] rounded-b-lg shadow-lg/30 overflow-hidden mb-6 border border-gray-200">
      {/* Cabeçalho */}
      <div className="bg-[#38ac1b] text-white rounded-2xl px-4 py-2 font-bold uppercase text-sm flex justify-between items-center">
        <div>
          PEDIDO REALIZADO
          <div className="text-[13px] font-normal">{date}</div>
        </div>
        {total !== undefined && (
          <div className="text-sm font-semibold text-right">
            Total:{" "}
            <span className="text-white">
              {total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        )}
      </div>

      {/* Corpo */}
      <div className="flex p-4 gap-4">
        <img
          src={productImage}
          alt={title}
          className="w-24 h-24 rounded shadow-sm object-cover"
        />

        <div className="flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-500 text-sm mt-1 line-clamp-3">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
            <span className="bg-[#38ac1b] text-white text-center rounded-full px-3 py-1 text-[13px] font-semibold w-fit">
              Quantidade: {quantity < 10 ? `0${quantity}` : quantity}
            </span>

            <span
              className={`${getStatusColor()} px-3 py-1 text-xs font-semibold rounded-full w-fit`}
            >
              {getStatusText()}
            </span>

            <button
              onClick={() => setIsOpen(true)}
              disabled={!isAvaliable}
              className={`${
                isAvaliable
                  ? "bg-[#38ac1b] hover:bg-green-700 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white text-[13px] font-semibold px-4 py-1 rounded-full transition`}
            >
              {isAvaliable ? "Avaliar o produto" : "Aguardando confirmação"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && isAvaliable && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Avaliar Produto
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={title}
                disabled
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-text"
              />

              <textarea
                name="description"
                placeholder="Escreva sua avaliação..."
                required
                className="w-full border rounded-lg px-3 py-2 h-24"
              />

              {/* Upload */}
              <div>
                <label
                  htmlFor="photo"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                >
                  <span className="text-sm text-gray-500">
                    Adicionar imagem (opcional)
                  </span>
                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {previews.map((src, index) => (
                      <div key={index} className="relative">
                        <img
                          src={src}
                          alt={`preview-${index}`}
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Estrelas */}
              <div className="flex flex-col items-center space-y-2">
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                    >
                      <span
                        className={`text-2xl transition ${
                          star <= rating ? "text-[#3fe216]" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>

                {rating === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selecione uma nota de 1 a 5 estrelas para enviar.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || rating === 0}
                className={`w-full cursor-pointer py-2 rounded-lg text-white font-semibold transition ${
                  rating === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#3fe216] hover:bg-green-600"
                }`}
              >
                {loading ? "Enviando..." : "Enviar Avaliação"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
