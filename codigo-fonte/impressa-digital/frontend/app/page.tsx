import type { ReactNode } from "react";
import HeaderDashboard from "../app/components/layout/headerDashboard";
import Navbar from "../app/components/layout/navbar";
import Carrossel from "./components/layout/Carrossel";


export default function Home({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeaderDashboard />
      <Navbar/>
      <Carrossel/>
  
      
    </div>
  );
}
