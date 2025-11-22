// Arquivo: productDetail.tsx
"use client";

import React, { ChangeEvent, useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useCart } from "@/app/contexts/CartContext";
import { ModalCart } from "./modalCart";
import CustomQuantitySelect from "./customQuantitySelect";

// URL Base da API (Mantida)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Category {
  id: number;
  nome: string;
}

interface Product {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  slug: string; 
  status?: string;
  categoria: Category; 
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
  productIdentifier: string | string[] | undefined;
  onProductStatusChange: (isActive: boolean) => void;
}

// Interfaces de frete foram removidas

// ----------------------------------------------------
// Componentes de Ícones (mantidos)
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { itemCount, addItemToCart } = useCart(); 

  useEffect(() => {
    if (!productIdentifier) {
      setError("Identificador do produto não fornecido.");
      setLoading(false);
      onProductStatusChange(false); 
      return;
    }

    const slug = Array.isArray(productIdentifier)
      ? productIdentifier[0]
      : productIdentifier;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setSelectedImageIndex(0); 

        const res = await fetch(`${BASE_URL}/products/slug/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Produto não encontrado.");
          } else {
            setError("Erro ao buscar produto.");
          }
          onProductStatusChange(false); 
          return;
        }
        const data = (await res.json()) as Product;

        if (data.status === "inativo") {
          setError(
            "O produto que você procura não está disponível no momento."
          );
          setProduct(null);
          onProductStatusChange(false);
          return;
        }

        setProduct({
          ...data,
          status: data.status === "inativo" ? "Inativo" : "Ativo",
        });
        onProductStatusChange(true); 
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setProduct(null);
        onProductStatusChange(false); 
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();

  }, [productIdentifier, onProductStatusChange]); 

  // Funções de utilidade (mantidas)
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
    
  // ✅ CORREÇÃO: Garante que 'quantity' nunca seja NaN
  const handleChangeQuantity = (newQuantity: number) => {
    // Garante que a quantidade seja um número finito e positivo. Se não for, usa 1.
    const sanitizedQuantity = (Number.isFinite(newQuantity) && newQuantity > 0) ? newQuantity : 1;

    // Garante que a quantidade seja no mínimo 1
    setQuantity(Math.max(1, sanitizedQuantity));
  };


  // FUNÇÃO ADICIONAR AO CARRINHO
  const handleAddToCart = useCallback(async () => {
    // Adiciona verificação explícita contra NaN ou zero
    if (!product || quantity < 1 || isNaN(quantity)) return; 
    
    // O objeto enviado ao CartContext precisa incluir as dimensões para o frete funcionar
    // na tela do carrinho (page.tsx)
    const itemToAdd = {
      id: product.id,
      produtoId: product.id,
      title: product.nome,
      price: product.preco,
      quantity: quantity,
      image:
        product.midias?.[selectedImageIndex]?.url || "/images/placeholder.png",
      // Adicionando dimensões e peso
      peso: Number(product.peso) || 0.5,
      largura: Number(product.largura) || 10,
      altura: Number(product.altura) || 10,
      comprimento: Number(product.comprimento) || 10,
    };

    const success = await addItemToCart(itemToAdd);

    if (success) {
      setIsModalOpen(true);
    } else {
      alert("Falha ao adicionar o produto ao carrinho. Tente novamente.");
    }
  }, [
    product, 
    quantity, 
    addItemToCart, 
    selectedImageIndex, 
  ]); 
  
  // ... (Navegação de imagem) ...
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


  if (loading) return <div>Carregando...</div>;

  if (error || !product)
    return (
      <div className="flex justify-center items-center w-full h-64">
        <div className="text-2xl font-bold text-gray-700 text-center p-10">
          {error || "Produto não encontrado."}
        </div>
      </div>
    );

  const imageUrl =
    product.midias?.[selectedImageIndex]?.url || "/images/placeholder.png";

  return (
    <>
      <ModalCart
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemCount={itemCount}
      />

      <div className="flex flex-col w-full md:p-6 items-center md:items-start gap-6 mt-6">
        <div className="flex flex-col md:flex-row w-full items-start gap-8">

          {/* Container de Imagens (1/3) */}
          <div className=" w-full md:w-1/3 flex flex-col gap-4 mt-4 md:mt-0">
            {/* Imagem Principal */}
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
            {product.midias && product.midias.length > 1 && (
              <div className="flex justify-center gap-2 overflow-x-auto p-2">
                {product.midias!.map((media, index) => (
                    <div
                        key={media.id}
                        className={`cursor-pointer rounded-lg p-1 transition-all flex-shrink-0 
                            ${index === selectedImageIndex
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
                className="text-white font-bold mt-2 px-4 py-1 rounded-2xl w-fit"
                style={{ background: "#3cc10c" }}
              >
                Personalizado
              </span>
              <span
                className="text-white font-bold mt-2 px-4 py-1 rounded-2xl w-fit"
                style={{ background: "#3cc10c" }}
              >
                {product.categoria?.nome || "Sem categoria"}
              </span>
            </div>

            <p className="text-[32px] font-sans font-[inter] font-bold mt-2">
              {formatPrice(product.preco)}
            </p>

            {/* Seletor de Quantidade */}
            <div className="flex flex-col gap-4 mt-4 w-full md:w-2/3">
              <CustomQuantitySelect
                quantity={quantity}
                onChange={handleChangeQuantity} 
              />
              {/* Botão Adicionar ao Carrinho */}
              <button
                type="button"
                onClick={handleAddToCart} 
                disabled={!product || isNaN(quantity) || quantity < 1} // Adicionado disabled para NaN
                className={`
                  bg-[#3cc10c] text-white text-sm md:text-md font-semibold p-2 rounded-2xl focus:outline-none transition
                   ${(!product || isNaN(quantity) || quantity < 1) 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#3cc10c] hover:bg-green-600'
                  }`
                }
              >
                Adicionar ao Carrinho
              </button>
            </div>
            
          </div>
          
          {/* Coluna 3 - Agora vazia ou para informações extras */}
          <div className="w-full md:w-1/3 flex flex-col gap-4 mt-4 md:mt-0">
            {/* O cálculo de frete foi movido para page.tsx (Carrinho) */}
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