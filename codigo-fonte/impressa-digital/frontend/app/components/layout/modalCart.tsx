// Arquivo: components/ModalCart.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface ModalCartProps {
  isOpen: boolean;
  onClose: () => void;
  itemCount: number; 
}

export const ModalCart = ({ isOpen, onClose, itemCount }: ModalCartProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    // Redireciona para a página do carrinho
    router.push("/perfil/carrinho"); 
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Produto Adicionado!</h3>
        
        <p className="text-gray-600 mb-6">
          Seu carrinho agora tem <span className="font-bold text-[#1a9d20]">{itemCount}</span> {itemCount === 1 ? 'item' : 'itens'}.
        </p>

        <div className="flex flex-col gap-3">
          {/* Opção 1: Continuar Comprando (Apenas fecha o modal) */}
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-300 transition"
          >
            Continuar Comprando
          </button>
          
          {/* Opção 2: Finalizar Compra (Redireciona para o carrinho) */}
          <button
            type="button"
            onClick={handleCheckout}
            className="w-full bg-[#1a9d20] text-white font-semibold py-3 rounded-xl hover:bg-[#17851b] transition"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
};