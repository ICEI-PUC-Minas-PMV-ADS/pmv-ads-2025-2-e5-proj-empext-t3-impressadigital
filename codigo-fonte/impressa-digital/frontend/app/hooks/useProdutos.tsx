"use client";
import { useState, useEffect } from "react";

export interface Produto {
  id: number;
  nome: string;
  imagem?: string;
  preco?: number;
  categoria_id: number;
}

export function useProdutos(categoriaId?: number) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = async () => {
    try {
      const res = await fetch("http://localhost:3000/products");
      if (!res.ok) throw new Error("Erro ao buscar produtos");
      const data: Produto[] = await res.json();

      let lista = data;
      if (categoriaId) {
        lista = data.filter((p) => Number(p.categoria_id) === categoriaId);
      }

      lista = lista.map((p) => ({
        ...p,
        imagem: p.imagem || "/images/placeholder.png",
      }));

      setProdutos(lista);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, [categoriaId]);

  // 🔄 Atualiza quando um produto novo é adicionado
  useEffect(() => {
    const reload = () => fetchProdutos();
    window.addEventListener("produto_adicionado", reload);
    return () => window.removeEventListener("produto_adicionado", reload);
  }, []);

  return { produtos, loading };
}
