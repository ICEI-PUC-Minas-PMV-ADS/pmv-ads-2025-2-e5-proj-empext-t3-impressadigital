'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Produtos', path: '/dashboard_products' },
  { label: 'Categorias', path: '/dashboard_category' },
  { label: 'Clientes', path: '/clientes' },
  { label: 'Configurações', path: '/configuracoes' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[20%] bg-gray-100 text-[#000000] h-screen p-4 flex flex-col font-bold font-sans items-center text-xl">
      <nav className="flex flex-col gap-6 mt-20">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`p-2 rounded transform transition-all duration-200 hover:scale-105 ${
              pathname === item.path ? 'text-[#45A62D] font-semibold' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
