// Arquivo: contexts/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

// Interface para opções de frete
export interface ShippingOption {
    carrier: string;
    logo: string;
    deliveryTime: string;
    price: number;
}

// Defina o tipo de item que será armazenado no carrinho
interface MinimalCartItem {
    id: number;
    produtoId: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
    peso: number;
    largura: number;
    altura: number;
    comprimento: number;
}

interface CartContextType {
  itemCount: number;
  addItemToCart: (item: MinimalCartItem) => Promise<boolean>;
  setTotalItemCount: (count: number) => void;
  
  savedShipping: {
      cep: string;
      selectedOption: ShippingOption | null;
      hasCalculated: boolean;
  };
  setSavedShipping: (data: { cep: string; selectedOption: ShippingOption | null, hasCalculated: boolean }) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Componente Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [itemCount, setItemCount] = useState(0); 
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const [savedShipping, setSavedShipping] = useState<{ 
      cep: string; 
      selectedOption: ShippingOption | null; 
      hasCalculated: boolean;
  }>({
      cep: '',
      selectedOption: null,
      hasCalculated: false,
  });

  const setSavedShippingData = useCallback((data: { cep: string; selectedOption: ShippingOption | null, hasCalculated: boolean }) => {
      setSavedShipping(data);
  }, []);


  // Simula a adição ao backend e atualiza a contagem local
  const addItemToCart = useCallback(async (item: MinimalCartItem): Promise<boolean> => {
    try {
        // ✅ ENVIA A QUANTIDADE SELECIONADA CORRETAMENTE
        const res = await fetch(`${BASE_URL}/carrinho`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                produto_id: item.produtoId, 
                user_id: 1, 
                quantidade: item.quantity, 
            }), 
        });

        if (!res.ok) {
            console.error("Falha ao adicionar ao carrinho no backend");
            return false;
        }

        // Incrementa a contagem TOTAL de unidades no estado global
        setItemCount(prev => prev + item.quantity); 
        return true;
    } catch (e) {
        console.error("Erro ao comunicar com o backend:", e);
        return false;
    }
  }, [BASE_URL]);
  
  // Função para sincronizar a contagem após carregar o carrinho
  const setTotalItemCount = useCallback((count: number) => {
    setItemCount(count);
  }, []);

  return (
    <CartContext.Provider 
      value={{ 
          itemCount, 
          addItemToCart, 
          setTotalItemCount,
          savedShipping, 
          setSavedShipping: setSavedShippingData 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};