"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
// REMOVIDO: import { ChevronLeft, ChevronRight } from 'lucide-react';

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
}

interface ProductDetailsProps {
    // Renomeado para ser mais genérico
    productIdentifier: string | string[] | undefined; 
    // PROPRIEDADE ADICIONADA: Callback para notificar o status ao componente pai
    onProductStatusChange: (isActive: boolean) => void;
}

// ----------------------------------------------------
// Componente de Seta Esquerda (Substituindo ChevronLeft)
// ----------------------------------------------------
const ArrowLeftIcon = ({ className = "text-gray-800", size = 24 }: { className?: string, size?: number }) => (
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
        <path d="m15 18-6-6 6-6"/>
    </svg>
);

// ----------------------------------------------------
// Componente de Seta Direita (Substituindo ChevronRight)
// ----------------------------------------------------
const ArrowRightIcon = ({ className = "text-gray-800", size = 24 }: { className?: string, size?: number }) => (
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
        <path d="m9 18 6-6-6-6"/>
    </svg>
);
// ----------------------------------------------------


export default function ProductDetails({ productIdentifier, onProductStatusChange }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // NOVO ESTADO: Índice da mídia atualmente selecionada
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); 

  useEffect(() => {
    if (!productIdentifier) {
        setError("Identificador do produto não fornecido.");
        setLoading(false);
        onProductStatusChange(false); // Produto não encontrado
        return;
    }
    
    const slug = Array.isArray(productIdentifier) ? productIdentifier[0] : productIdentifier;

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
            setError("O produto que você procura não está disponível no momento.");
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
  if (error || !product) return (
      <div className="flex justify-center items-center w-full h-64">
          <div className="text-2xl font-bold text-gray-700 text-center p-10">
              {/* Texto explícito para produto inativo/não encontrado */}
              {error || "Produto não encontrado."} 
          </div>
      </div>
  );
  // Fim da alteração de renderização (retorna o conteúdo completo se ativo)

  const imageUrl = product.midias?.[selectedImageIndex]?.url || "/images/placeholder.png";
  const hasMultipleImages = product.midias && product.midias.length > 1;


  return (
    <div className="flex flex-col md:flex-row p-6 items-start gap-4">
      
      {/* Container de Imagens (1/3) */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        
        {/* Imagem Principal com Navegação (Setas) */}
        <div className="relative flex justify-center py-5 bg-[#F3F3F3] rounded-lg">
            
            {/* Botão de seta esquerda */}
            {hasMultipleImages && (
                <button 
                    onClick={handlePrevImage} 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/70 rounded-full shadow-md z-10 hover:bg-white transition"
                    aria-label="Imagem anterior"
                >
                    {/* USO DO SVG INLINE (ArrowLeftIcon) */}
                    <ArrowLeftIcon size={24} className="text-gray-800" />
                </button>
            )}

            <div className="flex items-center px-2 bg-white rounded-lg">
                <Image
                    src={imageUrl}
                    width={300}
                    height={300}
                    alt={product.nome}
                    className="rounded-lg shadow object-contain"
                />
            </div>

            {/* Botão de seta direita */}
            {hasMultipleImages && (
                <button 
                    onClick={handleNextImage} 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/70 rounded-full shadow-md z-10 hover:bg-white transition"
                    aria-label="Próxima imagem"
                >
                    {/* USO DO SVG INLINE (ArrowRightIcon) */}
                    <ArrowRightIcon size={24} className="text-gray-800" />
                </button>
            )}
        </div>

        {/* Lista de Miniaturas (Thumbnails) */}
        {hasMultipleImages && (
            <div className="flex justify-center gap-2 overflow-x-auto p-2">
                {product.midias!.map((media, index) => (
                    <div 
                        key={media.id} 
                        className={`cursor-pointer rounded-lg p-1 transition-all flex-shrink-0 
                            ${index === selectedImageIndex 
                                ? 'border-2 border-[#3DF034] shadow-md' 
                                : 'border-2 border-transparent hover:border-gray-300'
                            }`
                        }
                        onClick={() => setSelectedImageIndex(index)}
                        style={{ width: '80px', height: '80px' }}
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
      <div className="w-full md:w-2/3 flex flex-col">
        <h1 className="text-2xl font-bold">{product.nome}</h1>

        <span
          className="text-black font-bold mt-2 px-4 py-1 rounded-2xl w-fit"
          style={{ background: "#3DF034" }}
        >
          {/* Acessamos o nome da categoria que veio na busca */}
          {product.categoria?.nome || "Sem categoria"} 
        </span>

        <p className="text-[32px] font-sans font-[inter] font-bold mt-2">
          {formatPrice(product.preco)}
        </p>
          

        <input
          type="text"
          placeholder="Escreva nome e idade"
          className="bg-[#e6e6e6] text-[#6B6B6B] text-lg pl-4 rounded-2xl p-2 w-2/3 mt-4 focus:outline-none  focus:border-[#3DF034] focus:border-2"
        />

        {/* INÍCIO DA NOVA SEÇÃO: Quantidade (Select) e Adicionar ao Carrinho */}
        <div className="flex items-center gap-4 mt-4 w-2/3">
          {/* Seletor de Quantidade (Limitado a 10) */}
          <select
            defaultValue="1"
            className="bg-[#e6e6e6] text-[#6B6B6B] text-lg pl-4 py-2 rounded-2xl w-1/4 text-center focus:outline-none focus:border-[#3DF034] focus:border-2 appearance-none cursor-pointer"
            aria-label="Quantidade do produto"
          >
            {/* Gera as opções de 1 a 10 */}
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          {/* Botão Adicionar ao Carrinho */}
          <button
            type="button"
            className="bg-[#3DF034] text-white text-lg font-semibold p-2 rounded-2xl  focus:outline-none hover:bg-green-600 transition"
          >
            Adicionar ao Carrinho
          </button>
        </div>
        {/* FIM DA NOVA SEÇÃO */}
       
        
        <div className="mt-8 w-2/3">
          <h4 className="font-bold font-sans">Descrição:</h4>
          <p className="mt-4 text-gray-700">{product.descricao}</p>
        </div>

        <div className="flex items-center self-end w-2/3 gap-2">
          <input type="text" name="cep" id="cep" placeholder="Calcule o seu frete aqui" maxLength={9}
            className="bg-[#e6e6e6] text-[#6B6B6B] text-sm font-bold font-sans rounded-2xl p-2 w-1/3 mt-4 focus:outline-none"
          />
          <button type="submit" className="bg-[#3DF034] text-white text-md font-semibold p-2 rounded-2xl p-2  mt-4 focus:outline-none">Buscar</button>
        </div>
      </div>
    </div>
  );
}
