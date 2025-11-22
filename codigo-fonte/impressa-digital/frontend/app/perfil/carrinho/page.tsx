// Arquivo: page.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useState, ChangeEvent } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/Authprovider';
import Image from "next/image";

type BackendCarrinho = { id: number; produto_id: number; user_id: number; criado_em: string; quantidade: number };
type BackendProduto = {
    id: number;
    nome: string;
    descricao?: string;
    preco?: number;
    midias?: Array<{ id: number; url: string }>;
    // PROPRIEDADES para frete
    peso?: number;
    largura?: number;
    altura?: number;
    comprimento?: number;
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
    // PROPRIEDADES para frete
    peso: number;
    largura: number;
    altura: number;
    comprimento: number;
};

// Interface para opções de frete (movida de productDetail.tsx)
interface ShippingOption {
    carrier: string;
    logo: string;
    deliveryTime: string;
    price: number;
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Tenta inferir a URL da API local quando a variável de ambiente não estiver definida
const inferLocalApi = () => {
    if (typeof window !== 'undefined') {
        // Se o front estiver na porta 3000, assumimos o backend em 3001
        if (window.location.port === '3000') return 'http://localhost:3001';
    }
    // Fallback padrão (backend em 3000)
    return 'http://localhost:3000';
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || inferLocalApi();

// --- Funções Auxiliares de Frete ---

const applyCepMask = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    const limitedValue = numericValue.slice(0, 8);
    return limitedValue.replace(/(\d{5})(\d)/, "$1-$2");
};

const formatarPrazoEntrega = (opcao: any): string => {
    if (opcao.delivery_range) {
        return `${opcao.delivery_range.min} a ${opcao.delivery_range.max} dias úteis`;
    } else if (opcao.delivery_time) {
        return `${opcao.delivery_time} dias úteis`;
    }
    return 'A consultar';
};

const obterLogoTransportadora = (nomeTransportadora: string): string => {
    if (nomeTransportadora.includes('jadlog')) {
        return '/images/jadlog-logo.png';
    } else if (nomeTransportadora.includes('azul')) {
        return '/images/azul-cargo-logo.png';
    }
    return '/images/transportadora-logo.png';
};

const processarOpcoesFrete = (data: any[]): ShippingOption[] => {
    const opcoesFiltradas: ShippingOption[] = [];

    data.forEach((opcao) => {
        const nomeTransportadora = opcao.company?.name?.toLowerCase() || '';
        const preco = parseFloat(opcao.price);
        const prazo = formatarPrazoEntrega(opcao);
        const logoUrl = opcao.company?.picture || obterLogoTransportadora(nomeTransportadora);

        const transportadoraValida =
            nomeTransportadora.includes('jadlog') ||
            nomeTransportadora.includes('azul') ||
            nomeTransportadora.includes('correio');

        const temPrecoValido = !isNaN(preco) && preco >= 0; // Preço pode ser zero
        const prazoValido = prazo && prazo.toLowerCase() !== 'a consultar';

        if (transportadoraValida && temPrecoValido && prazoValido) {
            const opcaoProcessada: ShippingOption = {
                carrier: opcao.company?.name || 'Transportadora',
                logo: logoUrl,
                deliveryTime: prazo,
                price: preco,
            };
            opcoesFiltradas.push(opcaoProcessada);
        }
    });

    return opcoesFiltradas;
};

// --- Fim das Funções Auxiliares de Frete ---


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
    // ... (CartLine component sem mudanças de lógica)
    return (
        <div className="relative flex flex-col md:flex-row gap-4 p-4 sm:p-5 md:p-6 rounded-3xl border border-gray-300 bg-white shadow-sm">
            <div className="flex-shrink-0">
                <div className="bg-gray-100 rounded-2xl p-2 sm:p-3 w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center overflow-hidden">
                    <Image
                        src={item.image}
                        alt={item.title}
                        width={160}
                        height={160}
                        className="object-cover w-full h-full rounded-lg"
                    />
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
                <div className="flex flex-row justify-between  md:items-center gap-3 sm:gap-4 mt-1 sm:mt-2">
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
    const { user, loading: authLoading } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadIndex, setReloadIndex] = useState(0);
    const { setTotalItemCount } = useCart();

    // NOVOS ESTADOS PARA FRETE
    const [cep, setCep] = useState<string>("");
    const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
    const [loadingShipping, setLoadingShipping] = useState(false);
    const [shippingError, setShippingError] = useState<string | null>(null);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
    const [isPickup, setIsPickup] = useState<boolean>(false);
    // NOVOS ESTADOS: Endereço e Observação para mensagem do WhatsApp
    const [endereco, setEndereco] = useState<string>("");
    const [observacao, setObservacao] = useState<string>("");
    const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""; //apenas dígitos

    // Estados para endereços salvos do usuário
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    // Formata um objeto de endereço vindo do backend para uma string legível.
    // Tentamos várias chaves possíveis por segurança (campo pode variar entre projetos).
    const formatAddress = (a: any) => {
        if (!a) return '';
        const parts: string[] = [];
        const rua = a.rua || a.logradouro || a.street || a.address_line || a.address || '';
        const numero = a.numero || a.number || a.n || '';
        const complemento = a.complemento || a.complement || a.extra || '';
        const bairro = a.bairro || a.neighborhood || a.district || '';
        const cidade = a.cidade || a.city || a.town || '';
        const uf = a.uf || a.state || a.region || '';
        const cepA = a.cep || a.postal_code || a.zip || '';

        if (rua) parts.push(rua + (numero ? `, ${numero}` : ''));
        if (complemento) parts.push(complemento);
        if (bairro) parts.push(bairro);
        if (cidade || uf) parts.push([cidade, uf].filter(Boolean).join('/'));
        if (cepA) parts.push(`CEP: ${cepA}`);

        return parts.filter(Boolean).join(' - ');
    };

    // Busca os endereços do usuário logado (perfil)
    const fetchAddresses = useCallback(async (userId: number) => {
        try {
            const res = await fetch(`${BASE_URL}/customer_address/user/${userId}`, {
                credentials: 'include',
            });
            if (!res.ok) return;
            const data = await res.json();
            if (Array.isArray(data)) {
                setAddresses(data);
                if (data.length > 0) {
                    // Prioriza o endereço marcado como principal
                    const preferred = data.find((a: any) =>
                        a?.is_primary === true || a?.isPrimary === true || a?.principal === true || a?.default === true || a?.padrao === true
                    ) || data[0];

                    setSelectedAddressId(String(preferred.id));
                    setEndereco(formatAddress(preferred));
                    const cepFound = preferred?.cep || preferred?.postal_code || '';
                    if (cepFound) setCep(applyCepMask(String(cepFound)));
                }
            }
        } catch (err) {
            // Falha ao buscar endereços: manter fallback para campo manual
            console.warn('Falha ao carregar endereços do perfil', err);
        }
    }, []);

    useEffect(() => {
        // Aguarda resolver auth; quando houver user.id, busca endereços dele
        if (!authLoading && user?.id) {
            fetchAddresses(user.id);
        }
        // Se deslogar, limpa endereços
        if (!authLoading && !user) {
            setAddresses([]);
            setSelectedAddressId(null);
            setEndereco("");
        }
    }, [authLoading, user, fetchAddresses]);

    const handleChangeCep = (event: ChangeEvent<HTMLInputElement>) => {
        const maskedValue = applyCepMask(event.target.value);
        setCep(maskedValue);
        // Reseta o frete ao mudar o CEP
        setShippingOptions([]);
        setSelectedOptionIndex(null);
        setShippingError(null);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Exige usuário logado para buscar o carrinho correto
            if (!user?.id) {
                setItems([]);
                setTotalItemCount(0);
                setLoading(false);
                return;
            }

            const res = await fetch(`${BASE_URL}/carrinho/user/${user.id}`, { cache: 'no-store', credentials: 'include' });
            if (!res.ok) throw new Error(`Erro ao buscar carrinho (${res.status})`);
            const registros: BackendCarrinho[] = await res.json();

            // Usar um Map para buscar informações de produtos únicos apenas uma vez
            const uniqueProductIds = Array.from(new Set(registros.map(reg => reg.produto_id)));
            const productResponses = await Promise.all(
                uniqueProductIds.map(async (id) => {
                    try {
                        const pr = await fetch(`${BASE_URL}/products/${id}`);
                        if (!pr.ok) return null;
                        return (await pr.json()) as BackendProduto;
                    } catch {
                        return null;
                    }
                })
            );
            const productMap = new Map<number, BackendProduto>(
                productResponses.filter(p => p !== null).map(p => [p!.id, p!])
            );

            const mapped: CartItem[] = registros.map((reg) => {
                const prod = productMap.get(reg.produto_id);
                const imageUrl = prod?.midias?.[0]?.url || '/images/placeholder.png';

                // Mapeia as dimensões com fallback para valores seguros
                const peso = Number(prod?.peso) || 0.5;
                const largura = Number(prod?.largura) || 10;
                const altura = Number(prod?.altura) || 10;
                const comprimento = Number(prod?.comprimento) || 10;

                // A quantidade inicial é sempre 1 no backend atual, mas aqui será o estado.
                // Na próxima iteração, faremos um fetch para saber a quantidade real se o
                // backend salvar essa informação. Por enquanto, a manipulação fica no front.

                return {
                    id: String(reg.id),
                    produtoId: reg.produto_id,
                    title: prod?.nome || `Produto #${reg.produto_id}`,
                    description: prod?.descricao || '(sem descrição)',
                    price: prod?.preco ? Number(prod.preco) : 0,
                    quantity: reg.quantidade, // Assumimos 1 pois o backend não retorna a quantidade no modelo atual
                    image: imageUrl,
                    customizable: false,
                    createdAt: reg.criado_em,
                    peso, largura, altura, comprimento,
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
    }, [setTotalItemCount, user?.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData, reloadIndex]);

    // Ao atualizar a quantidade, resetamos o frete para que seja recalculado
    const updateQuantity = useCallback((id: string, quantity: number) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: Math.max(1, quantity) } : it)));
        setShippingOptions([]); // Limpa as opções de frete
        setSelectedOptionIndex(null); // Deseleciona
        setShippingError(null);
    }, []);

    const removeItem = useCallback(
        async (id: string) => {
            setItems((prev) => prev.filter((it) => it.id !== id));
            // Atualiza contagem baseada no estado atual conhecido
            setTotalItemCount(Math.max(0, items.length - 1));
            setShippingOptions([]); // Limpa as opções de frete
            setSelectedOptionIndex(null);
            setShippingError(null);


            if (/^\d+$/.test(id)) {
                try {
                    await fetch(`${BASE_URL}/carrinho/${id}`, { method: 'DELETE' });
                } catch (e) {
                    console.warn('Falha ao remover no backend (ignorado)', e);
                }
            }
        },
        [setTotalItemCount, items.length]
    );

    const refresh = () => setReloadIndex((i) => i + 1);
    const subtotal = useMemo(() => items.reduce((acc, it) => acc + it.price * it.quantity, 0), [items]);

    const selectedShippingOption = useMemo(() => {
        return selectedOptionIndex !== null && shippingOptions.length > selectedOptionIndex
            ? shippingOptions[selectedOptionIndex]
            : null;
    }, [selectedOptionIndex, shippingOptions]);

    const handleSelectOption = useCallback((index: number) => {
        setIsPickup(false);
        setSelectedOptionIndex(index);
    }, []);

    // 🎯 LÓGICA CHAVE: Cálculo de Frete para o Carrinho Completo
    const handleCalculateShipping = useCallback(async () => {
        if (cep.length !== 9) {
            setShippingError("Por favor, digite um CEP válido (00000-000)");
            return;
        }
        if (items.length === 0) {
            setShippingError("O carrinho está vazio.");
            return;
        }

        setLoadingShipping(true);
        setShippingError(null);
        setShippingOptions([]);
        setSelectedOptionIndex(null);

        try {
            const cepNumerico = cep.replace(/\D/g, '');

            // Construir a lista de produtos com as dimensões e quantidades atuais (do estado do carrinho)
            const produtosApi = items.map(item => ({
                width: item.largura,
                height: item.altura,
                length: item.comprimento,
                weight: item.peso,
                quantity: item.quantity, // <--- QUANTIDADE CORRETA SENDO PASSADA AQUI
            }));

            const response = await fetch(`${BASE_URL}/frete/calcular`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cepDestino: cepNumerico,
                    produtos: produtosApi,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao calcular frete');
            }

            const data = await response.json();
            const opcoesProcessadas = processarOpcoesFrete(data);
            setShippingOptions(opcoesProcessadas);

            if (opcoesProcessadas.length === 0) {
                setShippingError("Nenhuma opção de frete disponível para este CEP");
            }

        } catch (err) {
            console.error('❌ Erro ao calcular frete:', err);
            setShippingError(err instanceof Error ? err.message : 'Erro ao calcular frete');
        } finally {
            setLoadingShipping(false);
        }
    }, [cep, items]);

    // 🧩 Monta a mensagem para WhatsApp com endereço, observação, valores e itens
    const buildWhatsappMessage = useCallback(() => {
        const linhas: string[] = [];
        linhas.push("Olá! Gostaria de concluir meu pedido.");
        linhas.push("");
        linhas.push("Itens:");
        items.forEach((it) => {
            const totalItem = it.price * it.quantity;
            linhas.push(`- ${it.quantity}x ${it.title} — ${currency.format(it.price)} = ${currency.format(totalItem)}`);
        });
        linhas.push("");
        linhas.push(`Subtotal: ${currency.format(subtotal)}`);
        if (isPickup) {
            linhas.push("Entrega: Retirada no local");
            //linhas.push(`Frete: ${currency.format(0)}`);
        } else if (selectedShippingOption) {
            linhas.push(
                `Frete (${selectedShippingOption.carrier} - ${selectedShippingOption.deliveryTime}): ${currency.format(selectedShippingOption.price)}`
            );
        } else {
            linhas.push("Frete: a calcular");
        }
        const total = subtotal + (isPickup ? 0 : (selectedShippingOption?.price || 0));
        linhas.push(`Total: ${currency.format(total)}`);
        linhas.push("");
        if (!isPickup) {
            if (cep) {
                linhas.push(`CEP: ${cep}`);
            }
            linhas.push(`Endereço: ${endereco || "(não informado)"}`);
        }
        if (observacao) {
            linhas.push(`Observação: ${observacao}`);
        }
        return linhas.join("\n");
    }, [items, subtotal, selectedShippingOption, isPickup, cep, endereco, observacao]);

    // � Abre o WhatsApp com a mensagem montada
    const enviarWhatsapp = useCallback(() => {
        const mensagem = buildWhatsappMessage();
        const numeroLimpo = WHATSAPP_NUMBER.replace(/\D/g, "");
        const base = numeroLimpo ? `https://wa.me/55${numeroLimpo}` : "https://wa.me/";
        const url = `${base}?text=${encodeURIComponent(mensagem)}`;
        if (typeof window !== 'undefined') {
            window.open(url, '_blank');
        }
    }, [WHATSAPP_NUMBER, buildWhatsappMessage]);

    // �🟢 Função principal: Fechar pedido
    const fecharPedido = async () => {
        if (!items.length) return;
        if (!selectedShippingOption) {
            alert("Por favor, calcule e selecione uma opção de frete para fechar o pedido.");
            return;
        }

        // Valor total final
        const valorTotal = subtotal + selectedShippingOption.price;

        try {
            // 1️⃣ Cria a venda
            const vendaResponse = await fetch(`${BASE_URL}/vendas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: 1,
                    valor_total: valorTotal, // VALOR TOTAL COM FRETE
                    status: "pendente",
                    data_venda: new Date(),
                    // Adicionar info de frete no body, se necessário
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
                    fetch(`${BASE_URL}/carrinho/${item.id}`, { method: "DELETE" }).catch(() => { })
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
                    {!authLoading && !user && (
                        <div className="text-center text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            Faça login para ver e gerenciar seu carrinho.
                        </div>
                    )}
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
                            <span className="text-gray-600">Subtotal ({items.length} itens)</span>
                            <span className="font-medium">{currency.format(subtotal)}</span>
                        </div>

                        {/* NOVO BLOCO DE FRETE */}
                        <div className="mt-2 pt-2 border-t border-gray-200">
                            <h4 className="text-sm font-semibold mb-2">Frete e Envio</h4>
                            <div className="flex flex-col gap-3">
                                {/* Escolha da forma de entrega */}
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { setIsPickup(true); setSelectedOptionIndex(null); setShippingOptions([]); setShippingError(null); }}
                                        className={`text-xs sm:text-sm font-semibold rounded-lg p-2 border transition cursor-pointer ${isPickup ? 'bg-[#F7FFF7] border-[#3DF034] text-[#0f8f1a]' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                                    >
                                        Retirada no local
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setIsPickup(false); setShippingError(null); }}
                                        className={`text-xs sm:text-sm font-semibold rounded-lg p-2 border transition cursor-pointer ${!isPickup ? 'bg-[#F7FFF7] border-[#3DF034] text-[#0f8f1a]' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                                    >
                                        Entrega
                                    </button>
                                </div>

                                {/* Campos de entrega apenas quando for entrega */}
                                {!isPickup && (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                maxLength={9}
                                                value={cep}
                                                onChange={handleChangeCep}
                                                className="bg-gray-100 text-sm font-medium rounded-lg p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-[#3DF034]"
                                                placeholder="00000-000"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCalculateShipping}
                                                disabled={loadingShipping || items.length === 0}
                                                className="bg-[#3DF034] cursor-pointer text-white text-sm font-semibold rounded-lg p-2 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                                            >
                                                {loadingShipping ? '...' : 'Buscar'}
                                            </button>
                                        </div>
                                        {shippingError && <p className="text-red-500 text-xs mt-1">{shippingError}</p>}
                                        {shippingOptions.length > 0 && (
                                            <div className="mt-1 flex flex-col gap-1 max-h-40 overflow-y-auto">
                                                {shippingOptions.map((option, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleSelectOption(index)}
                                                        className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer transition-all duration-200 ${selectedOptionIndex === index ? 'border-[#3DF034] bg-[#F7FFF7]' : 'border-gray-100 hover:border-gray-300'}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Image src={option.logo} width={20} height={20} alt={option.carrier} className="object-contain" />
                                                            <div>
                                                                <p className="font-medium text-xs leading-snug">{option.carrier}</p>
                                                                <p className="text-[10px] text-gray-500">{option.deliveryTime}</p>
                                                            </div>
                                                        </div>
                                                        <p className="font-bold text-sm">{currency.format(option.price)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* NOVOS CAMPOS: Endereço e Observação */}
                        <div className="mt-2 pt-2 border-t border-gray-200 flex flex-col gap-2">
                            <h4 className="text-sm font-semibold">Dados para contato</h4>
                            <label className="text-xs text-gray-600" htmlFor="enderecoSelect">Endereço para entrega</label>
                            {addresses.length > 0 ? (
                                <select
                                    id="enderecoSelect"
                                    value={selectedAddressId ?? ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSelectedAddressId(val);
                                        const addr = addresses.find(a => String(a.id) === val);
                                        setEndereco(formatAddress(addr));
                                        const cepFound = addr?.cep || addr?.postal_code || '';
                                        if (cepFound) setCep(applyCepMask(String(cepFound)));
                                    }}
                                    className="w-full bg-gray-100 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#3DF034]"
                                >
                                    {addresses.map((a) => (
                                        <option key={a.id} value={String(a.id)}>{formatAddress(a)}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    Nenhum endereço cadastrado. Vá até a aba de <a href="/perfil/editarPerfil" className="text-[#1a9d20] underline font-semibold">Perfil</a> para cadastrar seu endereço de entrega.
                                </div>
                            )}

                            <label className="text-xs text-gray-600" htmlFor="observacao">Observação</label>
                            <input
                                id="observacao"
                                type="text"
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                                className="w-full bg-gray-100 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#3DF034]"
                                placeholder="Ex.: Portaria 24h, ligar antes de entregar, etc."
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Frete</span>
                            <span className="font-medium">
                                {isPickup ? 'Retirada no local' : (selectedShippingOption ? currency.format(selectedShippingOption.price) : 'A calcular')}
                            </span>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex items-center justify-between text-base font-bold">
                            <span>Total</span>
                            <span>{currency.format(subtotal + (isPickup ? 0 : (selectedShippingOption?.price || 0)))}</span>
                        </div>

                        <button
                            type="button"
                            onClick={enviarWhatsapp}
                            disabled={!items.length || !selectedAddressId}
                            className="w-full bg-[#25D366] cursor-pointer hover:bg-[#1ebe57] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-colors"
                        >
                            Enviar por WhatsApp
                        </button>

                        <button
                            type="button"
                            onClick={refresh}
                            className="w-full text-xs text-[#1a9d20] cursor-pointer font-semibold underline mt-1"
                        >
                            Atualizar lista
                        </button>
                    </div>
                </aside>
            </div>

        </div>
    );
}