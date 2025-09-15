
// app/casamento/page.tsx
import HeaderDashboard from "../components/layout/headerMain"; // Header padrão do dashboard


export default function CasamentoPage() {
  const produtos = Array.from({ length: 20 }, () => ({
    nome: "Convite Alice no País das Maravilhas",
    imagem: "/images/cvtAlicePaisMaravilhas.png",
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER PADRÃO DO DASHBOARD */}
      <HeaderDashboard />

      {/* CONTEÚDO - PRODUTOS */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtos.map((produto, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center p-4"
            >
              {/* Container polaroid menor */}
              <div className="bg-white p-1 rounded-md shadow-md w-48 h-48 flex items-center justify-center">
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-40 h-40 object-cover rounded-md"
                />
              </div>

              {/* Título */}
              <h3 className="mt-4 font-bold text-center text-gray-800 text-sm">
                {produto.nome}
              </h3>

              {/* Botão */}
              <button className="mt-2 bg-green-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-green-700 transition text-sm">
                Ver opções
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
