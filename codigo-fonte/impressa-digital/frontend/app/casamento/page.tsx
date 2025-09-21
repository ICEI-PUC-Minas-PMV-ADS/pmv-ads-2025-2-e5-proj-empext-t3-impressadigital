import HeaderDashboard from "../components/layout/headerMain";
import ProdutosGrid from "../components/layout/ProdutosGrid";

export default function CasamentoPage() {
  const produtos = [
    { nome: "Convite Floral", imagem: "/images/casamento.jpg" },
    { nome: "Convite Clássico", imagem: "/images/casamento2.jpg" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeaderDashboard />
      <ProdutosGrid titulo="Convites de Casamento" produtos={produtos} />
    </div>
  );
}
