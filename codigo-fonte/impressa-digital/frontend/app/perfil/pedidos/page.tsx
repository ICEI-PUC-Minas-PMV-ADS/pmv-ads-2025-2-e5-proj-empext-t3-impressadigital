import React from "react";
import Sidebar from "@/app/components/layout/sidebarPerfil";
import OrderCard from "@/app/components/layout/orderCard";

const pedidosData = [
  {
    date: "22 de agosto de 2025",
    title: "Convite de aniversário Alice no País das Maravilhas",
    description:
      "Inclui personalização com o nome e a idade da aniversariante no painel. Clique em “ver coleção” no link amarelo acima da página para consultar ou encomendar individualmente os artigos deste tema encantado.",
    quantity: 1,
    productImage: "/convite.png",
  },
  {
    date: "22 de agosto de 2025",
    title: "Convite de aniversário Alice no País das Maravilhas",
    description:
      "Inclui personalização com o nome e a idade da aniversariante no painel. Clique em “ver coleção” no link amarelo acima da página para consultar ou encomendar individualmente os artigos deste tema encantado.",
    quantity: 1,
    productImage: "/convite.png",
  },
  {
    date: "22 de agosto de 2025",
    title: "Convite de aniversário Alice no País das Maravilhas",
    description:
      "Inclui personalização com o nome e a idade da aniversariante no painel. Clique em “ver coleção” no link amarelo acima da página para consultar ou encomendar individualmente os artigos deste tema encantado.",
    quantity: 1,
    productImage: "/convite.png",
  },
];

const PedidosPage: React.FC = () => {
  return (
    <div className="flex min-h-screen ">
      
          <div className="flex flex-col flex-1">
              <h2 className="text-2xl self-center font-bold text-gray-700 mb-6">Seus Pedidos</h2>
              <main className="flex-1 p-10">

        {pedidosData.map((pedido, index) => (
          <OrderCard
            key={index}
            date={pedido.date}
            title={pedido.title}
            description={pedido.description}
            quantity={pedido.quantity}
            productImage={pedido.productImage}
          />
        ))}
      </main>
      </div>
      
    </div>
  );
};

export default PedidosPage;