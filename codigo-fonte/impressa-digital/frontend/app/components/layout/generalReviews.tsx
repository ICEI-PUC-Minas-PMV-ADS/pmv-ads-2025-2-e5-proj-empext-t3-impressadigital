"use client";

import React, { useEffect, useState } from "react";

interface Review {
  id: number;
  // Assumindo que o nome do usuário vem dentro de 'user'
  user: { nome: string }; 
  avaliacoes: string;
  rating: number;
  midias?: { url: string }[];
  // Removendo 'produto', já que estamos pegando todas
  // produto: { id: number }; 
}

export default function GeneralReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        // *** ROTA AJUSTADA ***: Usando a rota base da coleção 'avaliacoes_produto'
        // Presume-se que o acesso à rota base retorna TODOS os itens da coleção.
        const apiUrl = `http://localhost:3000/avaliacoes_produto`;
        
        const res = await fetch(apiUrl);

        if (!res.ok) {
          // Trata o erro de forma informativa
          if (res.status === 404) {
             setError(`Erro 404: Endpoint da API "${apiUrl}" não encontrado. Verifique a rota no backend.`);
          } else {
             setError(`Erro ${res.status} ao buscar avaliações gerais. Detalhes: ${res.statusText}`);
          }
          setReviews([]);
          return;
        }
        
        const data = (await res.json()) as Review[];
        setReviews(data);

      } catch (err) {
        // Captura erros de rede (ex: servidor offline, CORS)
        setError(err instanceof Error ? `Erro de Rede: ${err.message}` : "Erro desconhecido ao carregar avaliações.");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllReviews();
  }, []); // Array de dependência vazio garante que a busca ocorra apenas uma vez

  // Função auxiliar para renderizar estrelas
  const renderStars = (rating: number) => {
    // Garante que o rating seja um número entre 0 e 5
    const safeRating = Math.max(0, Math.min(5, Math.round(rating))); 
    const filledStars = "★".repeat(safeRating);
    const emptyStars = "☆".repeat(5 - safeRating);
    return (
      <span className="text-[#3fe216] text-xl">
        {filledStars}{emptyStars}
      </span>
    );
  };

  if (loading) return <div className="text-center py-8">Carregando avaliações...</div>;
  if (error) return <div className="text-center text-red-500 py-8 font-bold">{error}</div>;
  if (reviews.length === 0) return <div className="text-center py-8 text-gray-600">Nenhuma avaliação encontrada.</div>;

  return (
    <section className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {reviews.map((r) => (
        <div key={r.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-md transition transform hover:shadow-lg hover:scale-[1.01] duration-300">
          <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-lg text-gray-800">@{r.user?.nome || "Usuário Anônimo"}</p>
              {renderStars(r.rating)}
          </div>
          <p className="text-gray-700 mt-2 line-clamp-4">{r.avaliacoes}</p>
          {/* Opcional: Renderizar primeira mídia se existir */}
          {r.midias && r.midias.length > 0 && (
              <img 
                // Certifique-se de que a URL existe antes de tentar renderizar
                src={r.midias[0]?.url || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='} 
                alt="Mídia da avaliação" 
                className="mt-3 w-full h-32 object-cover rounded-md"
              />
          )}
        </div>
      ))}
      <div className="col-span-full text-center mt-4">
          <button className="text-[#3fe216] font-bold hover:underline transition">
            Mostrar Todas as {reviews.length} Avaliações
          </button>
      </div>
    </section>
  );
}
