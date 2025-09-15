import Link from "next/link";

export default function Navbar() {
  // Lista de categorias com labels e rotas
  const categories = [
    { label: "Inicio", href: "http://localhost:3000/" },
    { label: "Categorias", href: "http://localhost:3000/" },
    { label: "Novidades", href: "http://localhost:3000/" },
    { label: "Ofertas", href: "http://localhost:3000/" },
    { label: "Fale conosco", href: "http://localhost:3000/" },
  ];

  return (
    <header className="p-4">
      <nav className="flex flex-col items-center justify-center gap-4">
        
        {/* Botões */}
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat, i) => (
            <Link key={i} href={cat.href}>
              <button
                className="w-32 h-12 bg-green-600 text-white font-bold text-sm 
               rounded-lg hover:bg-green-700 transition-all shadow-md"
     >
                {cat.label}
              </button>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
