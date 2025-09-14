import Link from "next/link";

function StatCard({ title, value }: { title: string; value: number | string }) {
    return (
        <div className="w-64 lg:w-56 relative h-40 rounded-2xl border border-gray-200 bg-white  p-4 flex items-center justify-center">
            <span className="absolute top-3 left-4 text-md font-bold">{title}</span>
            <span className="text-5xl font-extrabold text-[#4DC53E] leading-none">{value}</span>
        </div>
    );
}

type RecentProduct = {
    id: number;
    image: string; // ex: "/images/cvtAlicePaisMaravilhas.png"
    name: string;
    category: string;
    price: string; // ex: "R$ 79,90"
};

function RecentProductsPanel({ items }: { items: RecentProduct[] }) {
    const data = items.slice(0, 3);
    return (
        <section className="bg-white rounded-2xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-3">Produtos recentes</h2>

            <div className="hidden md:block">
                <table className="w-full table-fixed border-separate border-spacing-0">
                    <thead>
                        <tr className="text-left text-sm text-gray-500">
                            <th className="py-2 px-3 ">Imagem</th>
                            <th className="py-2 px-3 ">Nome</th>
                            <th className="py-2 px-3 ">Categoria</th>
                            <th className="py-2 px-3 ">Preço</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((p, i) => (
                            <tr key={p.id} className={i % 2 ? "bg-gray-50/60" : ""}>
                                <td className="py-3 px-3">
                                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                                </td>
                                <td className="py-3 px-3 truncate">{p.name}</td>
                                <td className="py-3 px-3 truncate">{p.category}</td>
                                <td className="py-3 px-3 font-semibold">{p.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ul className="md:hidden space-y-3">
                {data.map((p) => (
                    <li key={p.id} className="border border-gray-200 rounded-xl p-3">
                        <div className="flex gap-3">
                            <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" />
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold truncate">{p.name}</div>
                                <div className="text-sm text-gray-500 mt-0.5 truncate">{p.category}</div>
                                <div className="text-base font-bold mt-1">{p.price}</div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function WebsitePanel() {
    return (
        <section className="bg-white rounded-2xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-3">Site</h2>
            <div className="flex items-center justify-between gap-4">

            </div>
        </section>
    );
}

function QuickShortcutsPanel() {
    const shortcuts = [
        { label: "Cadastrar novo produto", href: "/dashboard/products" },
        { label: "Adicionar destaque", href: "/dashboard/category" },
        { label: "Adicionar carrossel", href: "/dashboard/" },

    ];
    return (
        <section className="bg-white rounded-2xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-3">Atalhos rápidos</h2>
            <div className="flex flex-col gap-2">
                {shortcuts.map((s) => (
                    <Link
                        key={s.href}
                        href={s.href}
                        className="flex items-center gap-2 text-sm font-medium border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4DC53E]/40"
                    >
                        <span
                            aria-hidden
                            className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4DC53E] text-white leading-none"
                        >
                            +
                        </span>
                        <span className="truncate">{s.label}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function FeaturedThemesPanel() {
    const themes = [
        { id: 1, title: "Convite Alice", image: "/images/cvtAlicePaisMaravilhas.png" },
        { id: 2, title: "Convite Marvel", image: "/images/cvtAlicePaisMaravilhas.png" },
        { id: 3, title: "Convite DC", image: "/images/cvtAlicePaisMaravilhas.png" },
    ];
    return (
        <section className="bg-white rounded-2xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-3">Temas em destaque</h2>
            <ul className="space-y-3">
                {themes.map((t) => (
                    <li key={t.id} className="flex items-center gap-3">
                        <img src={t.image} alt={t.title} className="w-12 h-12 object-cover rounded" />
                        <span className="font-medium text-[#4B4B4B]">{t.title}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default function Dashboard() {
    return (
        <div className="text-black flex flex-col gap-6">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

            <div className="flex flex-wrap gap-4 lg:gap-2">
                <StatCard title="Produtos" value={128} />
                <StatCard title="Pedidos" value={42} />
                <StatCard title="Temas em destaque" value={6} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna esquerda */}
                <div className="flex flex-col gap-6">
                    <RecentProductsPanel
                        items={[
                            { id: 1, image: "/images/cvtAlicePaisMaravilhas.png", name: "Convite Alice", category: "Eventos", price: "R$ 79,90" },
                            { id: 2, image: "/images/cvtAlicePaisMaravilhas.png", name: "Convite Marvel", category: "Eventos", price: "R$ 249,90" },
                            { id: 3, image: "/images/cvtAlicePaisMaravilhas.png", name: "Convite DC", category: "Eventos", price: "R$ 199,90" },
                        ]}
                    />
                    <WebsitePanel />
                </div>

                {/* Coluna direita */}
                <div className="flex flex-col gap-6">
                    <QuickShortcutsPanel />
                    <FeaturedThemesPanel />
                </div>
            </div>
        </div>
    );
}