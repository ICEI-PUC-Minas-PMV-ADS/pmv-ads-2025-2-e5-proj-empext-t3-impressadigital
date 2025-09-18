import NavBar from "../components/layout/navbar";
import ProdutosGrid from "../components/layout/ProdutosGrid";

export default function InfantilPage() {
  const produtos = [
    { nome: "Convite Alice ", imagem: "/images/cvtAlicePaisMaravilhas.png" },
    { nome: "Convite Super-Heróis", imagem: "/images/cvtAlicePaisMaravilhas.png" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <ProdutosGrid titulo="Convites Infantis" produtos={produtos} />
    </div>
  );
}
