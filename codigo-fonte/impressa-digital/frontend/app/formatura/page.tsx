import NavBar from "../components/layout/navbar";
import ProdutosGrid from "../components/layout/ProdutosGrid";

export default function FormaturaPage() {
  const produtos = [
    { nome: "Adesivo  Óculos ", imagem: "/images/adesivooculos.jpg" },
    { nome: "Convite Medicina", imagem: "/images/conviteformatura.jpg" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <ProdutosGrid titulo="Convites de Formatura" produtos={produtos} />
    </div>
  );
}

//import { useEffect, useState } from "react";
//import HeaderDashboard from "../components/layout/headerMain";
//import ProdutosGrid from "../components/layout/ProdutosGrid";

//export default function FormaturaPage() {
  //const [produtos, setProdutos] = useState([]);

  //useEffect(() => {
    // Exemplo de fetch de produtos de um servidor/API
   // fetch("/api/produtos")
   //   .then(res => res.json())
   //   .then(data => setProdutos(data));
 // }, []);

 // return (
 //   <div className="min-h-screen flex flex-col bg-gray-50">
  //   <HeaderDashboard />
 //    <ProdutosGrid titulo="Convites de Formatura" produtos={produtos} />
////    </div>
  //);
//}
