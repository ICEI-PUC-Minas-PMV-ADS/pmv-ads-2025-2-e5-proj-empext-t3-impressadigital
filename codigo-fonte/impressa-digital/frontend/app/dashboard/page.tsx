'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

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

type FeaturedCategory = {
    id: string; // usando nome ou categoria_id como string
    title: string; // nome da categoria
    image: string; // imagem de referência de um produto da categoria
    count: number; // quantidade de produtos
};

function RecentProductsPanel({ items, loading, error }: { items: RecentProduct[]; loading: boolean; error?: string }) {
    const data = items.slice(0, 3);
    return (
        <section className="bg-white rounded-2xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-3">Produtos recentes</h2>
            {loading && <p className="text-sm text-gray-500">Carregando...</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {!loading && !error && data.length === 0 && (
                <p className="text-sm text-gray-500">Nenhum produto cadastrado ainda.</p>
            )}
            {!loading && !error && data.length > 0 && (
                <>
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
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
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
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
                </>
            )}
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
        { label: "Adicionar carrossel", href: "/dashboard/carrossel" },

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

function FeaturedThemesPanel({ items, loading }: { items: FeaturedCategory[]; loading: boolean }) {
    const badge = (
        <span
            className="text-xs font-medium bg-[#4DC53E]/10 text-[#228f17] px-2 py-0.5 rounded-full"
            aria-label={`Total de temas em destaque: ${items.length}`}
        >
            {loading ? '…' : items.length}
        </span>
    );
    return (
        <section className="bg-white rounded-2xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">Temas em destaque {badge}</h2>
            {loading && <p className="text-sm text-gray-500">Carregando...</p>}
            {!loading && items.length === 0 && <p className="text-sm text-gray-500">Nenhuma categoria ainda.</p>}
            {!loading && items.length > 0 && (
                <ul className="space-y-3">
                    {items.map((t) => (
                        <li key={t.id} className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={t.image} alt={t.title} className="w-12 h-12 object-cover rounded" />
                            <div className="flex flex-col">
                                <span className="font-medium text-[#4B4B4B] leading-tight">{t.title}</span>
                                <span className="text-xs text-gray-500">{t.count} produto{t.count !== 1 ? 's' : ''}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default function Dashboard() {
    const [produtos, setProdutos] = useState<RecentProduct[]>([]);
    const [vendas, setVendas] = useState<any[]>([]);
    const [loadingProdutos, setLoadingProdutos] = useState(true);
    const [loadingVendas, setLoadingVendas] = useState(true);
    const [errorProdutos, setErrorProdutos] = useState<string | undefined>();
    const [errorVendas, setErrorVendas] = useState<string | undefined>();
    const [featuredCategories, setFeaturedCategories] = useState<FeaturedCategory[]>([]);
    const [loadingFeatured, setLoadingFeatured] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

        const formatCurrency = (value: number) => {
            if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
        };

        async function loadProdutos() {
            try {
                setLoadingProdutos(true);
                const res = await fetch(`${baseUrl}/products`, { signal: controller.signal });
                if (!res.ok) throw new Error(`Erro ao buscar produtos (${res.status})`);
                const data = await res.json();
                const raw: any[] = Array.isArray(data) ? data : [];

                // Top 3 categorias (por contagem de produtos)
                const categoryMap = new Map<string, { id: string; name: string; count: number; image: string }>();
                for (const p of raw) {
                    const catName = p.categoria?.nome || 'Sem categoria';
                    const catId = (p.categoria?.id ?? catName).toString();
                    const existing = categoryMap.get(catId);
                    if (existing) {
                        existing.count += 1;
                        // Mantém imagem já definida
                    } else {
                        const imageCandidate = p.midias?.[0]?.url || '/images/cvtAlicePaisMaravilhas.png';
                        categoryMap.set(catId, { id: catId, name: catName, count: 1, image: imageCandidate });
                    }
                }
                const categoriesSorted = Array.from(categoryMap.values())
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 3)
                    .map(c => ({ id: c.id, title: c.name, image: c.image, count: c.count }));
                setFeaturedCategories(categoriesSorted);
                setLoadingFeatured(false);

                const mapped: RecentProduct[] = raw
                    .sort((a: any, b: any) => b.id - a.id)
                    .map((p: any) => ({
                        id: p.id,
                        image: p.midias?.[0]?.url || '/images/cvtAlicePaisMaravilhas.png',
                        name: p.nome,
                        category: p.categoria?.nome || '—',
                        price: formatCurrency(Number(p.preco)),
                    }));
                setProdutos(mapped);
            } catch (err: any) {
                if (err.name !== 'AbortError') setErrorProdutos(err.message || 'Erro desconhecido ao carregar produtos');
                setLoadingFeatured(false);
            } finally {
                setLoadingProdutos(false);
            }
        }

        async function loadVendas() {
            try {
                setLoadingVendas(true);
                const res = await fetch(`${baseUrl}/vendas`, { signal: controller.signal });
                if (!res.ok) throw new Error(`Erro ao buscar vendas (${res.status})`);
                const data = await res.json();
                setVendas(Array.isArray(data) ? data : []);
            } catch (err: any) {
                if (err.name !== 'AbortError') setErrorVendas(err.message || 'Erro desconhecido ao carregar vendas');
            } finally {
                setLoadingVendas(false);
            }
        }

        loadProdutos();
        loadVendas();
        return () => controller.abort();
    }, []);

    const totalPedidos = vendas.length;
    const temasEmDestaque = featuredCategories.length;

    return (
        <div className="text-black flex flex-col gap-6">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

            <div className="flex flex-wrap gap-4 lg:gap-2">
                <StatCard title="Produtos" value={loadingProdutos ? '...' : produtos.length} />
                <StatCard title="Pedidos" value={loadingVendas ? '...' : totalPedidos} />
                <StatCard title="Temas em destaque" value={temasEmDestaque} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna esquerda */}
                <div className="flex flex-col gap-6">
                    <RecentProductsPanel items={produtos} loading={loadingProdutos} error={errorProdutos} />
                    <WebsitePanel />
                </div>

                {/* Coluna direita */}
                <div className="flex flex-col gap-6">
                    <QuickShortcutsPanel />
                    <FeaturedThemesPanel items={featuredCategories} loading={loadingFeatured} />
                    {errorVendas && <p className="text-sm text-red-600">{errorVendas}</p>}
                </div>
            </div>
        </div>
    );
}