"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/app/contexts/CartContext";
import { ModalCart } from "./modalCart";
import CustomQuantitySelect from "./customQuantitySelect";
interface Category {
  id: number;
  nome: string;
}

// A entidade Produtos do backend inclui a categoria e mídias
interface Product {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  slug: string; // Adicionado para garantir tipagem
  status?: string;
  categoria: Category; // Categoria completa vem da busca por slug no backend
  midias?: Array<{
    id: number;
    url: string;
  }>;
  peso?: number;
  largura?: number;
  altura?: number;
  comprimento?: number;
}

interface ProductDetailsProps {
  // Renomeado para ser mais genérico
  productIdentifier: string | string[] | undefined;
  // PROPRIEDADE ADICIONADA: Callback para notificar o status ao componente pai
  onProductStatusChange: (isActive: boolean) => void;
}

// Interface para opções de frete
interface ShippingOption {
  carrier: string;
  logo: string;
  deliveryTime: string;
  price: number;
}

// ----------------------------------------------------
// Componente de Seta Esquerda (Substituindo ChevronLeft)
// ----------------------------------------------------
const ArrowLeftIcon = ({
  className = "text-gray-800",
  size = 24,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

// ----------------------------------------------------
// Componente de Seta Direita (Substituindo ChevronRight)
// ----------------------------------------------------
const ArrowRightIcon = ({
  className = "text-gray-800",
  size = 24,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
// ----------------------------------------------------

export default function ProductDetails({
  productIdentifier,
  onProductStatusChange,
}: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // NOVO ESTADO: Índice da mídia atualmente selecionada
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [cep, setCep] = useState<string>("");
  // NOVOS ESTADOS ADICIONADOS
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para o cálculo de frete
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  


  const { itemCount, addItemToCart } = useCart(); // Uso do contexto

  useEffect(() => {
    if (!productIdentifier) {
      setError("Identificador do produto não fornecido.");
      setLoading(false);
      onProductStatusChange(false); // Produto não encontrado
      return;
    }

    const slug = Array.isArray(productIdentifier)
      ? productIdentifier[0]
      : productIdentifier;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setSelectedImageIndex(0); // Reseta o índice ao carregar novo produto

        // *** MUDANÇA PRINCIPAL: Buscar produto usando o endpoint de SLUG ***
        const res = await fetch(`http://localhost:3000/products/slug/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Produto não encontrado.");
          } else {
            setError("Erro ao buscar produto.");
          }
          onProductStatusChange(false); // Notifica o pai que o produto não foi encontrado
          return;
        }
        const data = (await res.json()) as Product;

        // *** LÓGICA REQUERIDA: Verificar status 'inativo' ***
        if (data.status === "inativo") {
          // Define a mensagem explícita e notifica o pai como "inativo"
          setError(
            "O produto que você procura não está disponível no momento."
          );
          setProduct(null);
          onProductStatusChange(false);
          return;
        }

        // Se ativo, define o produto e notifica o pai
        setProduct({
          ...data,
          status: data.status === "inativo" ? "Inativo" : "Ativo",
        });
        onProductStatusChange(true); // Notifica o pai como "ativo"
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setProduct(null);
        onProductStatusChange(false); // Notifica o pai em caso de erro
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productIdentifier, onProductStatusChange]); // Dependência adicionada

  // Funções de navegação de imagem
  const handlePrevImage = () => {
    if (!product || !product.midias) return;
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? product.midias!.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    if (!product || !product.midias) return;
    setSelectedImageIndex((prevIndex) =>
      prevIndex === product.midias!.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleChangeCep = (event: ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyCepMask(event.target.value);
    setCep(maskedValue);
  };

  const handleChangeQuantity = (event: ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(event.target.value));
  };

  // ----------------------------------------------------
  // FUNÇÃO ADICIONAR AO CARRINHO
  // ----------------------------------------------------
  const handleAddToCart = async () => {
    if (!product || quantity < 1) return;

    // 1. Monta o item mínimo para adicionar
    const itemToAdd = {
      id: product.id,
      produtoId: product.id,
      title: product.nome,
      price: product.preco,
      quantity: quantity,
      image:
        product.midias?.[selectedImageIndex]?.url || "/images/placeholder.png",
    };

    // 2. Chama a função de adicionar ao carrinho do contexto
    const success = await addItemToCart(itemToAdd);

    // 3. Se for bem-sucedido, abre o modal.
    if (success) {
      setIsModalOpen(true);
    } else {
      alert("Falha ao adicionar o produto ao carrinho. Tente novamente.");
    }
  };

  // ----------------------------------------------------
  // FUNÇÕES PARA CÁLCULO DE FRETE
  // ----------------------------------------------------

  // Função para calcular frete usando sua API
  const handleCalculateShipping = async () => {
    // Verifica se o CEP está completo
    if (cep.length !== 9) {
      setShippingError("Por favor, digite um CEP válido (00000-000)");
      return;
    }

    if (!product) {
      setShippingError("Produto não carregado");
      return;
    }

    setLoadingShipping(true);
    setShippingError(null);
    setShippingOptions([]);

    try {
      const cepNumerico = cep.replace(/\D/g, ''); // Remove o hífen

      // Prepara os dados do produto para a API
      const produtosApi = [
      {
        width: Number(product.largura) || 10,
        height: Number(product.altura) || 10,
        length: Number(product.comprimento) || 10,
        weight: Number(product.peso) || 0.5,
        quantity: Number(quantity) || 1,
       
      },
    ];

      console.log('📦 Enviando dados para cálculo de frete:', {
        cepDestino: cepNumerico,
        produtos: produtosApi
      });

      const response = await fetch('http://localhost:3000/frete/calcular', {
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
      console.log('✅ Resposta da API de frete:', data);

      // Processa a resposta do Melhor Envio
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
  };

  // Função para processar a resposta do Melhor Envio e filtrar Jadlog, Azul Cargo e Correios
const processarOpcoesFrete = (data: any[]): ShippingOption[] => {
  const opcoesFiltradas: ShippingOption[] = [];

  data.forEach((opcao) => {
    const nomeTransportadora = opcao.company?.name?.toLowerCase() || '';
    const preco = parseFloat(opcao.price);
    const prazo = formatarPrazoEntrega(opcao);
    const logoUrl = opcao.company?.picture || obterLogoTransportadora(nomeTransportadora);

    // 🔎 Filtro de transportadoras desejadas
    const transportadoraValida =
      nomeTransportadora.includes('jadlog') ||
      nomeTransportadora.includes('azul') ||
      nomeTransportadora.includes('correio'); // inclui Correios

    // 🚫 Ignora opções sem preço ou prazo
    const temPrecoValido = !isNaN(preco) && preco > 0;
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



  // Função para obter a logo baseada no nome da transportadora
  const obterLogoTransportadora = (nomeTransportadora: string): string => {
    if (nomeTransportadora.includes('jadlog')) {
      return '/images/jadlog-logo.png';
    } else if (nomeTransportadora.includes('azul')) {
      return '/images/azul-cargo-logo.png';
    }
    return '/images/transportadora-logo.png';
  };

  // Função para formatar o prazo de entrega
  const formatarPrazoEntrega = (opcao: any): string => {
    if (opcao.delivery_range) {
      return `${opcao.delivery_range.min} a ${opcao.delivery_range.max} dias úteis`;
    } else if (opcao.delivery_time) {
      return `${opcao.delivery_time} dias úteis`;
    }
    return 'A consultar';
  };

  // ----------------------------------------------------
  // LÓGICA MANUAL DE MÁSCARA DE CEP
  // ----------------------------------------------------

  /**
   * Aplica a máscara de CEP (99999-999) a uma string, removendo caracteres não numéricos.
   * @param value O valor atual do input.
   * @returns O valor formatado.
   */
  const applyCepMask = (value: string): string => {
    // 1. Remove tudo que não é dígito (\D)
    const numericValue = value.replace(/\D/g, "");

    // 2. Limita a 8 dígitos (máximo do CEP)
    const limitedValue = numericValue.slice(0, 8);

    // 3. Aplica a máscara: 5 dígitos + hífen + 3 dígitos
    // Se houver mais de 5 dígitos, adiciona o hífen.
    return limitedValue.replace(/(\d{5})(\d)/, "$1-$2");
  };

  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    categoria_id: "",
    descricao: "",
    status: "",
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  if (loading) return <div>Carregando...</div>;

  // *** ALTERAÇÃO NO RENDER: Exibe a mensagem explícita se houver erro (incluindo "inativo") ***
  if (error || !product)
    return (
      <div className="flex justify-center items-center w-full h-64">
        <div className="text-2xl font-bold text-gray-700 text-center p-10">
          {/* Texto explícito para produto inativo/não encontrado */}
          {error || "Produto não encontrado."}
        </div>
      </div>
    );
  // Fim da alteração de renderização (retorna o conteúdo completo se ativo)

  const imageUrl =
    product.midias?.[selectedImageIndex]?.url || "/images/placeholder.png";
  const hasMultipleImages = product.midias && product.midias.length > 1;

  return (
    <>
      {/* Adicionar ModalCart aqui */}
      <ModalCart
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemCount={itemCount}
      />

      <div className="flex flex-col w-full md:p-6 items-center md:items-start gap-6 mt-6">
  <div className="flex flex-col md:flex-row w-full items-start gap-8">

          {/* Container de Imagens (1/3) */}
          <div className=" w-full md:w-1/3 flex flex-col gap-4 mt-4 md:mt-0">
            {/* Imagem Principal com Navegação (Setas) */}
            <div className="relative flex justify-center py-2 md:py-5 bg-[#F3F3F3] rounded-lg">
              <Image
                src={imageUrl}
                width={300}
                height={300}
                alt={product.nome}
                className="rounded-lg object-contain"
              />
            </div>

            {/* Lista de Miniaturas (Thumbnails) */}
            {hasMultipleImages && (
              <div className="flex justify-center gap-2 overflow-x-auto p-2">
                {product.midias!.map((media, index) => (
                  <div
                    key={media.id}
                    className={`cursor-pointer rounded-lg p-1 transition-all flex-shrink-0 
                            ${
                              index === selectedImageIndex
                                ? "border-2 border-[#3DF034] shadow-md"
                                : "border-2 border-transparent hover:border-gray-300"
                            }`}
                    onMouseOver={() => setSelectedImageIndex(index)}
                    style={{ width: "80px", height: "80px" }}
                  >
                    <Image
                      src={media.url}
                      width={70}
                      height={70}
                      alt={`Miniatura ${index + 1}`}
                      className="rounded object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Fim do Container de Imagens (1/3) */}

          {/* Informações (2/3) */}
          <div className="w-full md:w-1/3 flex flex-col gap-4 mt-4 md:mt-0">
            <h1 className="text-sm md:text-2xl font-bold">{product.nome}</h1>
            <div className="flex flex-wrap flex-row gap-2">
              <span
                className="text-black font-bold mt-2 px-4 py-1 rounded-2xl w-fit"
                style={{ background: "#3DF034" }}
              >
                Personalizado
              </span>
              <span
                className="text-black font-bold mt-2 px-4 py-1 rounded-2xl w-fit"
                style={{ background: "#3DF034" }}
              >
                {/* Acessamos o nome da categoria que veio na busca */}
                {product.categoria?.nome || "Sem categoria"}
              </span>
            </div>

            <p className="text-[32px] font-sans font-[inter] font-bold mt-2">
              {formatPrice(product.preco)}
            </p>

            {/* INÍCIO DA NOVA SEÇÃO: Quantidade (Select) e Adicionar ao Carrinho */}
            <div className="flex flex-col  gap-4 mt-4 w-full md:w-2/3">
              {/* Seletor de Quantidade (Limitado a 10) */}

              <CustomQuantitySelect
                quantity={quantity}
                onChange={handleChangeQuantity}
              />
              {/* Botão Adicionar ao Carrinho */}
              <button
                type="button"
                onClick={handleAddToCart} // Adicionado onClick
                className="bg-[#3DF034] text-white text-sm md:text-md font-semibold p-2 rounded-2xl  focus:outline-none hover:bg-green-600 transition"
              >
                Adicionar ao Carrinho
              </button>
            </div>
            
          </div>
          
          {/* Espaço de opção de frete*/}
          <div className="w-full md:w-1/3 flex flex-col gap-4 mt-4 md:mt-0">
            <span className=" self-start font-bold">Calcular frete:</span>
            <div className="flex items-center md:justify-normal  gap-2">
              <input
                type="text"
                name="cep"
                id="cep"
                maxLength={9}
                value={cep}
                onChange={handleChangeCep}
                className="bg-[#e6e6e6] text-[#6B6B6B]  pl-2  text-sm font-bold font-sans rounded-2xl p-2 
            w-[45%] md:w-2/3 mt-4 focus:outline-none"
                placeholder="00000-000"
              />
              <button
                type="button"
                onClick={handleCalculateShipping}
                disabled={loadingShipping}
                className="bg-[#3DF034] md:w-1/3 text-white text-md font-semibold
          rounded-2xl p-2  mt-4 focus:outline-none cursor-pointer disabled:bg-gray-400"
              >
                {loadingShipping ? 'Calculando...' : 'Buscar'}
              </button>
            </div>

            {/* Mensagem de erro */}
            {shippingError && (
              <div className="text-red-500 text-sm mt-2">{shippingError}</div>
            )}

            {/* Loading */}
            {loadingShipping && (
              <div className="text-gray-600 text-sm mt-2">Calculando frete...</div>
            )}

            {/* Opções de frete */}
    
{shippingOptions.length > 0 && (
  <div className="mt-4 w-full">
    <span className="font-bold">Opções de frete:</span>
    <div className="flex flex-col gap-3 mt-2">
      {shippingOptions.map((option, index) => (
        <div
          key={index}
          onClick={() => setSelectedOptionIndex(index)} // ✅ Clique seleciona
          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200
            ${
              selectedOptionIndex === index
                ? 'border-[#3DF034] shadow-md bg-[#F7FFF7]' // ✅ Selecionado
                : 'border-gray-200 hover:border-gray-400' // Normal
            }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src={option.logo}
                width={40}
                height={40}
                alt={option.carrier}
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-semibold">{option.carrier}</p>
              <p className="text-sm text-gray-600">{option.deliveryTime}</p>
            </div>
          </div>
          <p className="font-bold text-lg">{formatPrice(option.price)}</p>
        </div>
      ))}
    </div>
  </div>
)}

          </div>
        </div>

        <div className="mt-6 w-full md:w-2/3">
          <h4 className="font-bold font-sans">Descrição:</h4>
          <p className="mt-4 text-gray-700">
            {"Peso: " + product.peso + "Kg"} <br />
            {"Dimensões: "}
            {product.largura + "cm"} x
            {product.altura + "cm"} x
            {product.comprimento + "cm"} <br />
            {product.descricao}</p>
        </div>
      </div>
    </>
  );
}