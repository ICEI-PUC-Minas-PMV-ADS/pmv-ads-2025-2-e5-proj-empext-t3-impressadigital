"use client";

import HeaderDashboard from "@/app/components/layout/headerMain";
import ProdutosGrid from "@/app/components/layout/ProdutosGrid";
import { useProdutos } from "@/app/hooks/useProdutos";
import { useParams } from "next/navigation";

// lista de categorias
const categories = [
  { id: 1, nome: "Casamento", slug: "casamento" },
  { id: 2, nome: "Festa Infantil", slug: "festa-infantil" },
  { id: 3, nome: "Aniversário Adulto", slug: "aniversario-adulto" },
  { id: 4, nome: "Eventos Corporativos", slug: "eventos-corporativos" },
  { id: 5, nome: "Formatura", slug: "formatura" },
  { id: 6, nome: "Chá de Bebê", slug: "cha-de-bebe" },
  { id: 7, nome: "Eventos Esportivos", slug: "eventos-esportivos" },
];

export default function CategoriaPage() {
  const params = useParams();
  const slug = params?.slug as string; // garante que seja string
  const categoria = categories.find((c) => c.slug === slug);

  if (!categoria) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <HeaderDashboard />
        <p className="text-center py-10 text-red-600 font-semibold">
          Categoria não encontrada 🚫
        </p>
      </div>
    );
  }

  // pega os produtos da categoria usando o hook
  const { produtos, loading } = useProdutos(categoria.id);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeaderDashboard />

      {loading ? (
        <p className="text-center py-10">Carregando produtos...</p>
      ) : produtos.length === 0 ? (
        <p className="text-center py-10 text-gray-500">
          Nenhum produto encontrado para esta categoria.
        </p>
      ) : (
        <ProdutosGrid
          titulo={`Produtos de ${categoria.nome}`}
          produtos={produtos}
        />
      )}
    </div>
  );
}
