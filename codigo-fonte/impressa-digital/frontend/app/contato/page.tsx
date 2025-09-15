// pages/contato.tsx
import HeaderDashboard from "../components/layout/headerMain"; 
import Image from "next/image";

export default function ContatoPage() {
  return (
    <div className="bg-gray-100 relative">
      {/* Header padrão do dashboard */}
      <HeaderDashboard />

      {/* Conteúdo da página */}
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start gap-12 relative bg-white">
        {/* Informações de contato */}
        <div className="bg-white p-8 rounded-xl shadow-md flex-1 z-10">
          <h1 className="text-3xl font-bold mb-6 text-black">Contato</h1>
          <div className="bg-gray-100 p-6 rounded-lg space-y-4 text-black">
            <h2 className="text-xl font-semibold">Impressa Digital</h2>
            <p>📧 contato@impressadigital.com.br</p>
            <p>📱 (31) 9 9140-7186</p>
          </div>
        </div>

        {/* Mascote / calango */}
        <div className="flex-1 hidden md:flex justify-end items-end">
          <Image
            src="/images/contato.png"
            alt="Mascote da Impressa Digital"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
