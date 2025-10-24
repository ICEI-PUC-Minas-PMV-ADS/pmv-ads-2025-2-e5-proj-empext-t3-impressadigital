'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useCart } from '../../contexts/CartContext';

type BackendCarrinho = { id: number; produto_id: number; user_id: number; criado_em: string; quantidade: number };
type BackendProduto = { 
    id: number; 
    nome: string; 
    descricao?: string; 
    preco?: number; 
    midias?: Array<{ id: number; url: string }>;
}; 

type CartItem = {
    id: string;
    produtoId: number;
    title: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    customizable?: boolean;
    createdAt?: string;
};

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function QuantityControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
        <div className="flex items-center gap-2 select-none">
            <button
                type="button"
                aria-label="Diminuir"
                disabled={value <= 1}
                onClick={() => value > 1 && onChange(value - 1)}
                className="px-3 py-2 rounded-md bg-[#4DC53E] text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] transition"
            >
                -
            </button>
            <span className="w-10 text-center font-mono font-bold text-base">{String(value).padStart(2, '0')}</span>
            <button
                type="button"
                aria-label="Aumentar"
                onClick={() => onChange(value + 1)}
                className="px-3 py-2 rounded-md bg-[#4DC53E] text-white text-sm font-semibold active:scale-[0.97] transition"
            >
                +
            </button>
        </div>
    );
}

function CartLine({
    item,
    onUpdate,
    onRemove,
}: {
    item: CartItem;
    onUpdate: (id: string, q: number) => void;
    onRemove: (id: string) => void;
}) {
    return (
        <div className="relative flex flex-col md:flex-row gap-4 p-4 sm:p-5 md:p-6 rounded-3xl border border-gray-300 bg-white shadow-sm">
            <div className="flex-shrink-0">
                <div className="bg-gray-100 rounded-2xl p-2 sm:p-3 w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center overflow-hidden">
                    <img src={item.image} alt={item.title} className="object-cover w-full h-full rounded-lg" />
                </div>
                <p className="mt-3 text-xs sm:text-sm font-semibold max-w-[8rem] sm:max-w-[10rem] leading-snug">
                    {item.title.split(' ').slice(0, 3).join(' ') + (item.title.split(' ').length > 3 ? '...' : '')}
                </p>
            </div>
            <div className="flex-1 flex flex-col gap-2 sm:gap-3">
                <h3 className="text-base sm:text-lg md:text-xl font-bold leading-snug">{item.title}</h3>
                {item.customizable && (
                    <span className="inline-block bg-[#14a800] text-white text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full tracking-wide w-fit">
                        PERSONALIZADO
                    </span>
                )}
                <p className="text-xl sm:text-2xl font-bold tracking-tight">{currency.format(item.price)}</p>
                <p className="text-xs sm:text-sm text-gray-600 max-w-prose leading-relaxed line-clamp-4">
                    {item.description}
                </p>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mt-1 sm:mt-2">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] sm:text-xs font-semibold bg-[#1a9d20] text-white px-2.5 sm:px-3 py-1 rounded-full">
                            Quantidade
                        </span>
                        <QuantityControl value={item.quantity} onChange={(q) => onUpdate(item.id, q)} />
                    </div>
                    <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="self-start md:self-auto bg-[#1a9d20] hover:bg-[#17851b] text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2 rounded-full transition-colors"
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Carrinho() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadIndex, setReloadIndex] = useState(0);
    const { setTotalItemCount } = useCart();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${BASE_URL}/carrinho`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`Erro ao buscar carrinho (${res.status})`);
            const registros: BackendCarrinho[] = await res.json();

            const produtoResponses = await Promise.all(
                registros.map(async (reg) => {
                    try {
                        const pr = await fetch(`${BASE_URL}/products/${reg.produto_id}`);
                        if (!pr.ok) return null;
                        return (await pr.json()) as BackendProduto;
                    } catch {
                        return null;
                    }
                })
            );

            const mapped: CartItem[] = registros.map((reg, idx) => {
                const prod = produtoResponses[idx];
                const imageUrl = prod?.midias?.[0]?.url || '/images/placeholder.png';

                return {
                    id: String(reg.id),
                    produtoId: reg.produto_id,
                    title: prod?.nome || `Produto #${reg.produto_id}`,
                    description: prod?.descricao || '(sem descrição)',
                    price: prod?.preco ? Number(prod.preco) : 0,
                    quantity: 1,
                    image: imageUrl,
                    customizable: false,
                    createdAt: reg.criado_em,
                };
            });

            setItems(mapped);
            setTotalItemCount(mapped.length);
        } catch (e: any) {
            setError(e.message || 'Erro inesperado');
            setItems([]);
            setTotalItemCount(0);
        } finally {
            setLoading(false);
        }
    }, [setTotalItemCount]);

    useEffect(() => {
        fetchData();
    }, [fetchData, reloadIndex]);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity } : it)));
    }, []);

    const removeItem = useCallback(
        async (id: string) => {
            setItems((prev) => prev.filter((it) => it.id !== id));
            setTotalItemCount((prev) => Math.max(0, prev - 1));

            if (/^\d+$/.test(id)) {
                try {
                    await fetch(`${BASE_URL}/carrinho/${id}`, { method: 'DELETE' });
                } catch (e) {
                    console.warn('Falha ao remover no backend (ignorado)', e);
                }
            }
        },
        [setTotalItemCount]
    );

    const refresh = () => setReloadIndex((i) => i + 1);
    const subtotal = useMemo(() => items.reduce((acc, it) => acc + it.price * it.quantity, 0), [items]);

    // 🟢 Função principal: Fechar pedido
    const fecharPedido = async () => {
        if (!items.length) return;

        try {
            // 1️⃣ Cria a venda
            const vendaResponse = await fetch(`${BASE_URL}/vendas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: 1, // 🔧 ajustar para pegar usuário logado
                    valor_total: subtotal,
                    status: "pendente",
                    data_venda: new Date(),
                }),
            });

            if (!vendaResponse.ok) throw new Error("Erro ao criar venda");
            const venda = await vendaResponse.json();

            // 2️⃣ Cria cada item da venda
            await Promise.all(
                items.map((item) =>
                    fetch(`${BASE_URL}/vendas_produtos`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            venda_id: venda.id,
                            produto_id: item.produtoId,
                            quantidade: item.quantity,
                            preco_unitario: item.price,
                        }),
                    })
                )
            );

            // 3️⃣ Limpa o carrinho no frontend e backend
            await Promise.all(
                items.map((item) =>
                    fetch(`${BASE_URL}/carrinho/${item.id}`, { method: "DELETE" }).catch(() => {})
                )
            );

            setItems([]);
            setTotalItemCount(0);

            // 4️⃣ Redireciona para página de pedidos
            window.location.href = "/perfil/pedidos";
        } catch (err) {
            console.error("Erro ao fechar pedido:", err);
            alert("Erro ao fechar o pedido. Tente novamente.");
        }
    };

    return (
        <div className="text-black flex flex-col gap-6 sm:gap-8 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">Carrinho de compras</h2>
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="flex-1 flex flex-col gap-5 sm:gap-6">
                    {loading && <p className="text-center text-gray-500 animate-pulse">Carregando itens...</p>}
                    {error && !loading && (
                        <div className="text-center text-red-600 text-sm">
                            Erro: {error}
                            <button type="button" onClick={refresh} className="ml-3 underline text-[#1a9d20] font-semibold">
                                Tentar novamente
                            </button>
                        </div>
                    )}
                    {!loading && !items.length && !error && (
                        <p className="text-center text-gray-500">Seu carrinho está vazio.</p>
                    )}
                    {items.map((it) => (
                        <CartLine key={it.id} item={it} onUpdate={updateQuantity} onRemove={removeItem} />
                    ))}
                </div>

                <aside className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-6 self-start">
                    <div className="bg-white border border-gray-300 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-3 sm:gap-4">
                        <h3 className="text-lg sm:text-xl font-semibold">Resumo do pedido</h3>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{currency.format(subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Frete</span>
                            <span className="font-medium">A calcular</span>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex items-center justify-between text-sm sm:text-base font-bold">
                            <span>Total</span>
                            <span>{currency.format(subtotal)}</span>
                        </div>

                        <button
                            type="button"
                            onClick={fecharPedido}
                            disabled={!items.length || loading}
                            className="mt-1 sm:mt-2 w-full bg-[#1a9d20] hover:bg-[#17851b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-colors"
                        >
                            Fechar pedido
                        </button>

                        <button
                            type="button"
                            onClick={refresh}
                            className="w-full text-xs text-[#1a9d20] font-semibold underline mt-1"
                        >
                            Atualizar lista
                        </button>
                    </div>
                </aside>
            </div>
            <p className="text-[10px] text-gray-400 text-center">
                (Implementação com backend: cada pedido será salvo na tabela vendas e vendas_produtos.)
            </p>
        </div>
    );
}
