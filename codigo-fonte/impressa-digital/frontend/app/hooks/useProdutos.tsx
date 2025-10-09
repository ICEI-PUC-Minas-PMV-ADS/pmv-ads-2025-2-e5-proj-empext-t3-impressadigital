"use client";
import { useState, useEffect } from "react";

export interface Produto {
  id: number;
  nome: string;
  imagem?: string;
  preco?: number;
  categoria_id: number;
}

export function useProdutos(slug?: string): { produtos: Produto[]; loading: boolean } {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = async () => {
    if (!slug) {
      setProdutos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 🔹 Busca produtos diretamente pelo slug
      const res = await fetch(`http://localhost:3000/products/categoria/${slug}`);
      if (!res.ok) throw new Error("Erro ao buscar produtos");

      let data: Produto[] = await res.json();

      // Adiciona placeholder de imagem
      data = data.map((p) => ({
        ...p,
        imagem: p.imagem || "/images/placeholder.png",
      }));

      setProdutos(data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Recarrega produtos quando o slug muda
  useEffect(() => {
    fetchProdutos();
  }, [slug]);

  // 🔹 Atualiza quando um produto novo é adicionado
  useEffect(() => {
    const reload = () => fetchProdutos();
    window.addEventListener("produto_adicionado", reload);
    return () => window.removeEventListener("produto_adicionado", reload);
  }, []);

  return { produtos, loading };
}
