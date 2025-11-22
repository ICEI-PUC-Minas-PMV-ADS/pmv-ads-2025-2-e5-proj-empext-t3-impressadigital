// customerReviews.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";

interface Review {
  id: number;
  user: { nome: string };
  avaliacoes: string;
  rating: number;
  produto: { id: number };
}

interface ProductInfo {
  id: number;
}

interface CustomerReviewsProps {
  productIdentifier: string | string[] | undefined;
}

export default function CustomerReviews({ productIdentifier }: CustomerReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    if (!productIdentifier) {
      setError("Identificador do produto não fornecido.");
      setLoading(false);
      return;
    }

    const slug = Array.isArray(productIdentifier) ? productIdentifier[0] : productIdentifier;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const mainProductRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/slug/${slug}`);
        if (!mainProductRes.ok) throw new Error("Erro ao buscar produto.");
        const mainProduct = (await mainProductRes.json()) as ProductInfo;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/avaliacoes_produto/produto/${mainProduct.id}`);
        if (!res.ok) throw new Error("Erro ao buscar avaliações.");
        const productReviews = (await res.json()) as Review[];

        setReviews(productReviews);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productIdentifier]);

  const { average, distribution } = useMemo(() => {
    if (reviews.length === 0) return { average: 0, distribution: [0, 0, 0, 0, 0] };

    const validReviews = reviews.filter((r) => typeof r.rating === "number" && !isNaN(r.rating));
    if (validReviews.length === 0) return { average: 0, distribution: [0, 0, 0, 0, 0] };

    const sum = validReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = sum / validReviews.length;

    const dist = [1, 2, 3, 4, 5].map((star) => validReviews.filter((r) => r.rating === star).length);

    return { average: avg, distribution: dist };
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const slug = Array.isArray(productIdentifier) ? productIdentifier[0] : productIdentifier;

    try {
      const mainProductRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/slug/${slug}`);
      if (!mainProductRes.ok) throw new Error("Erro ao buscar produto.");
      const mainProduct = (await mainProductRes.json()) as ProductInfo;

      const payload = {
        avaliacoes: formData.get("description"),
        rating,
        produto: { id: mainProduct.id },
      };

      const reviewRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/avaliacoes_produto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!reviewRes.ok) throw new Error("Erro ao criar avaliação.");

      const updatedReviewsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/avaliacoes_produto/produto/${mainProduct.id}`);
      const updatedReviews = await updatedReviewsRes.json();
      setReviews(updatedReviews);

      setIsOpen(false);
      setRating(0);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar avaliação");
    }
  };

  if (loading) return <div>Carregando avaliações...</div>;
  if (error) return <div className="text-red-500">Erro: {error}</div>;

  const reviewsToShow = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section className="p-0 md:p-6 mb-10">
      <div className="flex flex-col md:flex-row items-center md:w-full justify-between mb-6 bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center w-full md:w-1/3 text-center">
          <p className="text-5xl font-bold text-[#38ac1b]">{average.toFixed(1)}</p>
          <p className="text-yellow-500 text-2xl">{"★".repeat(Math.round(average))}{"☆".repeat(5 - Math.round(average))}</p>
          <p className="text-gray-500">{reviews.length} avaliações</p>
        </div>

        <div className="w-full md:w-2/3 space-y-2 mt-4 md:mt-0">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star - 1];
            const percent = reviews.length ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-6 text-sm font-semibold">{star}★</span>
                <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="h-3 bg-[#38ac1b]" style={{ width: `${percent}%` }}></div>
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {reviews.length > 0 ? (
        <>
          {reviewsToShow.map((r) => (
            <div key={r.id} className="border rounded-lg p-4 mb-4 bg-white shadow">
              <p className="font-semibold">{r.user?.nome || "Cliente"}</p>
              <p className="text-[#45A62D] text-xl">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
              <p className="text-gray-700 mt-2">{r.avaliacoes}</p>
            </div>
          ))}

          {reviews.length > 3 && !showAll && (
            <button onClick={() => setShowAll(true)} className="text-gray-600 hover:underline text-center w-full">
              Ver mais
            </button>
          )}
        </>
      ) : (
        <div className="text-gray-500 text-center py-8">Ainda não há avaliações para este produto.</div>
      )}

      <div className="mt-6 text-center">
        <button onClick={() => setIsOpen(true)} className="bg-[#38ac1b] text-white px-6 py-2 rounded-full hover:bg-green-700">
          Avaliar Produto
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold">
              ×
            </button>

            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Avaliar Produto</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea name="description" placeholder="Escreva sua avaliação..." required className="w-full border rounded-lg px-3 py-2 h-24" />

              <div className="flex flex-col items-center space-y-2">
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button type="button" key={star} onClick={() => setRating(star)}>
                      <span className={`text-2xl transition ${star <= rating ? "text-[#3fe216]" : "text-gray-300"}`}>★</span>
                    </button>
                  ))}
                </div>

                {rating === 0 && <p className="text-sm text-gray-500 mt-1">Selecione uma nota de 1 a 5 estrelas para enviar.</p>}
              </div>

              <button
                type="submit"
                disabled={rating === 0}
                className={`w-full cursor-pointer py-2 rounded-lg text-white font-semibold transition ${
                  rating === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#3fe216] hover:bg-green-600"
                }`}
              >
                Enviar Avaliação
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
