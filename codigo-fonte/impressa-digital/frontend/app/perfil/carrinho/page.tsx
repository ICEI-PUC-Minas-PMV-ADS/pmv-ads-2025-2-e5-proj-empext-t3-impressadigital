"use client";

import React, { useState, useMemo, useCallback } from "react";

type CartItem = {
    id: string;
    title: string;
    description: string;
    price: number; // unit price
    quantity: number;
    image: string;
    customizable?: boolean; // para mostrar badge "PERSONALIZADO"
};

const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
});

const initialItems: CartItem[] = [
    {
        id: "1",
        title: "Convite de aniversário Alice no País das Maravilhas",
        description:
            "Inclui personalização com o nome e a idade da aniversariante no painel. Clique em \"ver coleção\" no link amarelo acima da página para consultar ou encomendar individualmente os artigos deste tema encantado.",
        price: 0,
        quantity: 1,
        image: "/images/cvtAlicePaisMaravilhas.png",
        customizable: true,
    },
    {
        id: "2",
        title: "Convite de aniversário Alice no País das Maravilhas",
        description:
            "Inclui personalização com o nome e a idade da aniversariante no painel. Clique em \"ver coleção\" no link amarelo acima da página para consultar ou encomendar individualmente os artigos deste tema encantado.",
        price: 29.9,
        quantity: 1,
        image: "/images/cvtAlicePaisMaravilhas.png",
        customizable: true,
    },
];

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
            <span className="w-10 text-center font-mono font-bold text-base">{String(value).padStart(2, "0")}</span>
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

function CartLine({ item, onUpdate, onRemove }: { item: CartItem; onUpdate: (id: string, quantity: number) => void; onRemove: (id: string) => void }) {
    return (
        <div className="relative flex flex-col md:flex-row gap-4 p-4 sm:p-5 md:p-6 rounded-3xl border border-gray-300 bg-white shadow-sm">


            {/* Imagem */}
            <div className="flex-shrink-0">
                <div className="bg-gray-100 rounded-2xl p-2 sm:p-3 w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="object-cover w-full h-full rounded-lg"
                    />
                </div>
                <p className="mt-3 text-xs sm:text-sm font-semibold max-w-[8rem] sm:max-w-[10rem] leading-snug">
                    {item.title.split(" ").slice(0, 3).join(" ") + (item.title.split(" ").length > 3 ? "..." : "")}
                </p>
            </div>
            {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col gap-2 sm:gap-3">
                <h3 className="text-base sm:text-lg md:text-xl font-bold leading-snug">
                    {item.title}
                </h3>
                {item.customizable && (
                    <span className="inline-block bg-[#14a800] text-white text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full tracking-wide w-fit">
                        PERSONALIZADO
                    </span>
                )}
                <p className="text-xl sm:text-2xl font-bold tracking-tight">
                    {currency.format(item.price)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 max-w-prose leading-relaxed line-clamp-4">
                    {item.description}
                </p>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mt-1 sm:mt-2">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] sm:text-xs font-semibold bg-[#1a9d20] text-white px-2.5 sm:px-3 py-1 rounded-full">Quantidade</span>
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
    const [items, setItems] = useState<CartItem[]>(initialItems);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity } : it)));
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
    }, []);

    const subtotal = useMemo(
        () => items.reduce((acc, it) => acc + it.price * it.quantity, 0),
        [items]
    );

    return (
        <div className="text-black flex flex-col gap-6 sm:gap-8 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">Carrinho de compras</h2>
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="flex-1 flex flex-col gap-5 sm:gap-6">
                    {items.map((it) => (
                        <CartLine
                            key={it.id}
                            item={it}
                            onUpdate={updateQuantity}
                            onRemove={removeItem}
                        />
                    ))}
                    {items.length === 0 && (
                        <p className="text-center text-gray-500">Seu carrinho está vazio.</p>
                    )}
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
                            disabled={!items.length}
                            className="mt-1 sm:mt-2 w-full bg-[#1a9d20] hover:bg-[#17851b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-colors"
                        >
                            Fechar pedido
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}