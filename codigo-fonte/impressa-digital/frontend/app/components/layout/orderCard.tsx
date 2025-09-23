"use client"

import React, { useState } from "react"

interface OrderCardProps {
  date: string
  title: string
  description: string
  quantity: number
  productImage: string
}

const OrderCard: React.FC<OrderCardProps> = ({
  date,
  title,
  description,
  quantity,
  productImage,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState<number>(0)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const query = new URLSearchParams(formData as any).toString()
    // Exemplo de GET (você pode trocar pela rota correta da sua API)
    window.location.href = `/api/review?${query}`
  }

  return (
    <div className="bg-white w-[75%] rounded-b-lg shadow-lg/30 overflow-hidden mb-6">
      <div className="bg-[#38ac1b] text-white rounded-2xl px-4 py-2 font-bold uppercase text-sm">
        PEDIDO REALIZADO
        <div className="text-[13px] font-normal">{date}</div>
      </div>

      <div className="flex p-4 gap-4">
        <img
          src={productImage}
          alt={title}
          className="w-24 h-24 rounded shadow-sm object-cover"
        />
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-500 text-sm mt-1">{description}</p>
          </div>

          <div className="flex items-center justify-between gap-4 mt-4">
            <span className="bg-[#38ac1b] text-white text-center rounded-full px-3 py-1 text-[13px] font-semibold">
              Quantidade: {quantity < 10 ? `0${quantity}` : quantity}
            </span>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-[#38ac1b] text-white text-[13px] font-semibold px-4 py-1 rounded-full hover:bg-green-700 transition"
            >
              Avaliar o produto
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">
            {/* Botão fechar */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Avaliar Produto
            </h2>

            <form onSubmit={handleSubmit} method="GET" className="space-y-4">
              {/* Nome do produto */}
              <input
                type="text"
                value={title}
                disabled
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-text"
              />

              {/* Descrição */}
              <textarea
                name="description"
                placeholder="Escreva sua avaliação..."
                required
                className="w-full border rounded-lg px-3 py-2 h-24"
              />

              {/* Upload de Imagem */}
              <div>
  <label
    htmlFor="photo"
    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
  >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 
                    56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" /></svg>
    <span className="text-sm text-gray-500">Adicionar imagem</span>
    <input id="photo" name="photo" type="file" accept="image/*" className="hidden" />
  </label>
</div>

              {/* Estrelas */}
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                  >
                    <span
                      className={`text-2xl ${
                        star <= rating ? "text-[#3fe216]" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  </button>
                ))}
                <input type="hidden" name="rating" value={rating} />
              </div>

              {/* Botão de enviar */}
              <button
                type="submit"
                className="w-full cursor-pointer py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: "#3fe216" }}
              >
                Enviar Avaliação
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderCard
