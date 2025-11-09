"use client";

import React, { useEffect, useState } from "react";
import OrderCard from "@/app/components/layout/orderCard";
import { useAuth } from "@/app/contexts/Authprovider"; // Importe o useAuth

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco?: number;
  midias?: Array<{ id: number; url: string }>;
}

interface VendaProduto {
  id: number;
  venda_id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  produto: Produto;
}

interface Venda {
  id: number;
  user_id: number;
  valor_total: number;
  status: string;
  data_venda: string;
  produtos?: VendaProduto[];
}

const PedidosPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth(); // Use o hook de autenticação
  const [pedidos, setPedidos] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      // 🟢 VERIFICA SE O USUÁRIO ESTÁ LOGADO
      if (!user) {
        setLoading(false);
        setError("Usuário não autenticado. Faça login para ver seus pedidos.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 🟢 BUSCA APENAS AS VENDAS DO USUÁRIO LOGADO
        const vendasRes = await fetch(`${BASE_URL}/vendas?user_id=${user.id}`);
        if (!vendasRes.ok) throw new Error("Erro ao buscar vendas.");
        const vendas: Venda[] = await vendasRes.json();

        // 2️⃣ Para cada venda, busca os produtos associados
        const vendasComProdutos = await Promise.all(
          vendas.map(async (venda) => {
            try {
              const produtosRes = await fetch(
                `${BASE_URL}/vendas_produtos/venda/${venda.id}`
              );
              if (!produtosRes.ok) return { ...venda, produtos: [] };
              
              const produtos = await produtosRes.json();
              console.log(produtos);
              return { ...venda, produtos };
            } catch {
              return { ...venda, produtos: [] };
            }
          })
        );

        // 3️⃣ Ordena as vendas por data (mais recente primeiro)
        const ordenadas = vendasComProdutos.sort(
          (a, b) =>
            new Date(b.data_venda).getTime() - new Date(a.data_venda).getTime()
        );

        setPedidos(ordenadas);
      } catch (err: any) {
        console.error("Erro ao carregar pedidos:", err);
        setError("Erro ao carregar pedidos.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchPedidos();
    }
  }, [user, authLoading]); // 🟢 Adicione as dependências

  // 🟢 MOSTRA CARREGAMENTO DA AUTENTICAÇÃO
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-500">
        Verificando autenticação...
      </div>
    );
  }

  // 🟢 VERIFICA SE USUÁRIO ESTÁ LOGADO
  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] text-gray-500">
        <p className="text-lg mb-4">Você precisa estar logado para ver seus pedidos.</p>
        <button
          onClick={() => window.location.href = "/login"}
          className="bg-[#4DC53E] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#45b336] transition"
        >
          Fazer Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-500">
        Carregando pedidos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-3 underline text-green-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen max-h-[85vh] overflow-y-auto scrollbar-hide px-2 sm:px-4">
      <div className="flex flex-col items-center w-full">
        <h2 className="text-2xl self-center font-bold text-gray-700 mb-6">
          Seus Pedidos
        </h2>
        <main className="flex-1 w-full max-w-5xl p-4 sm:p-10">
          {pedidos.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              Nenhum pedido encontrado.
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {pedidos.map((pedido) =>
                pedido.produtos?.map((item) => (
                  <OrderCard
                    key={`${pedido.id}-${item.id}`}
                    date={new Date(pedido.data_venda).toLocaleDateString(
                      "pt-BR"
                    )}
                    title={item.produto?.nome || "Produto"}
                    description={item.produto?.descricao || ""}
                    quantity={item.quantidade}
                    productImage={
                      item.produto?.midias?.[0]?.url ||
                      "/images/placeholder.png"
                    }
                    total={pedido.valor_total}
                    status={pedido.status}
                    productId={item.produto?.id}
                  />
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PedidosPage;