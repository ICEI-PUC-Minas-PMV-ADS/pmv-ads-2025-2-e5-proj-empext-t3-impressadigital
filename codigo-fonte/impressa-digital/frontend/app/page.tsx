import type { ReactNode } from "react";
import HeaderDashboard from "../app/components/layout/headerDashboard";
import Navbar from "../app/components/layout/navbar";
import Carrossel from "./components/layout/Carrossel";
import CardSimples from "./components/layout/catalogo";


export default function Home({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeaderDashboard />
      <Navbar/>
      <Carrossel/>
      <CardSimples/>
      
  
      
    </div>
  );
}
