// Arquivo: contexts/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

// Defina o tipo de item que será armazenado no carrinho
interface MinimalCartItem {
    id: number;
    produtoId: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartContextType {
  itemCount: number;
  // Apenas simula a adição no frontend para atualizar o Header e chama o backend
  addItemToCart: (item: MinimalCartItem) => Promise<boolean>;
  // Função para sincronizar a contagem total, usada após carregar o carrinho em page.tsx
  setTotalItemCount: (count: number) => void;
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
  // Estado que armazena a contagem total de itens no carrinho
  const [itemCount, setItemCount] = useState(0); 
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Simula a adição ao backend e atualiza a contagem local
  const addItemToCart = useCallback(async (item: MinimalCartItem): Promise<boolean> => {
    try {
        // Simulação da chamada ao backend para ADICIONAR
        const res = await fetch(`${BASE_URL}/carrinho`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // O backend espera apenas o produto_id e user_id (simulado)
            // Se o seu backend espera a quantidade, inclua-a (aqui está simulado com 1)
            body: JSON.stringify({ produto_id: item.produtoId, user_id: 1, quantidade: item.quantity }), 
        });

        if (!res.ok) {
            console.error("Falha ao adicionar ao carrinho no backend");
            return false;
        }

        // Se a adição for bem-sucedida, incrementa a contagem no estado global
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
    <CartContext.Provider value={{ itemCount, addItemToCart, setTotalItemCount }}>
      {children}
    </CartContext.Provider>
  );
};