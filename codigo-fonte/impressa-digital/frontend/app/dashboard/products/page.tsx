"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: number;
  nome: string;
  preco: number;
  categoria_id: number;
  descricao?: string;
  categoria_nome?: string;
  midias?: Array<{
    id: number;
    url: string;
  }>;
  status?: string;
}

interface Category {
  id: number;
  nome: string;
}

const DashboardProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    categoria_id: "",
    descricao: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("http://localhost:3000/products"),
        fetch("http://localhost:3000/categories"),
      ]);

      if (!productsRes.ok) throw new Error("Erro ao buscar produtos");
      if (!categoriesRes.ok) throw new Error("Erro ao buscar categorias");

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      // Enriquecer produtos com nomes de categoria
      const enrichedProducts = productsData.map((product: Product) => ({
        ...product,
        categoria_nome: categoriesData.find(
          (cat: Category) => cat.id === product.categoria_id
        )?.nome,
        status: "Ativo",
      }));

      setProducts(enrichedProducts);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir produto");

      alert("Produto excluído com sucesso!");
      fetchData(); // Recarregar a lista
    } catch (err) {
      alert("Erro ao excluir produto");
      console.error("Erro:", err);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nome: product.nome,
      preco: product.preco.toString(),
      categoria_id: product.categoria_id.toString(),
      descricao: product.descricao || "",
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setFormData({
      nome: "",
      preco: "",
      categoria_id: "",
      descricao: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\./g, ",");
    value = value.replace(/[^0-9,]/g, "");

    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts[0] + "," + parts[1];
    }

    if (parts[1]?.length > 2) {
      value = parts[0] + "," + parts[1].slice(0, 2);
    }

    setFormData((prev) => ({
      ...prev,
      preco: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProduct) return;

    try {
      // Converter preço de string para número
      const precoNumerico = parseFloat(formData.preco.replace(",", "."));

      const response = await fetch(
        `http://localhost:3000/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: formData.nome,
            preco: precoNumerico,
            categoria_id: parseInt(formData.categoria_id),
            descricao: formData.descricao,
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar produto");

      alert("Produto atualizado com sucesso!");
      closeEditModal();
      fetchData(); // Recarregar a lista
    } catch (err) {
      alert("Erro ao atualizar produto");
      console.error("Erro:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Carregando...</div>
    );
  if (error) return <div className="text-red-500 p-4">Erro: {error}</div>;

  return (
    <div className="w-full bg-white p-6">
      <p className="text-black text-3xl lg:text-4xl font-bold">Produtos</p>

      <Link href="/dashboard/category" passHref>
        <button
          className="text-base font-sans font-extrabold text-white mt-4 px-4 py-2 bg-[#45A62D] 
                           rounded-2xl h-13 w-full md:w-60 cursor-pointer transform transition-all duration-200 
                           hover:scale-101"
        >
          + ADICIONAR PRODUTO
        </button>
      </Link>

      <div className="mt-8 w-full text-black">
        {/* Cabeçalho - Desktop */}
        <div className="bg-white rounded-lg shadow p-4 items-center font-semibold hidden md:flex">
          <div className="flex items-center gap-4 w-2/5">Nome / Imagem</div>
          <div className="w-1/5">Categoria</div>
          <div className="w-1/6">Preço</div>
          <div className="w-1/6">Status</div>
          <div className="flex justify-end gap-3 w-1/12">Ações</div>
        </div>

        {/* Lista de produtos */}
        <ul className="space-y-4 mt-2">
          {products.map((product) => (
            <li
              key={product.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              {/* Desktop layout */}
              <div className="hidden md:flex w-full items-center justify-between">
                <div className="flex items-center gap-4 w-2/5">
                  <img
                    src={product.midias?.[0]?.url || "/images/placeholder.png"}
                    alt={product.nome}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span className="font-semibold">{product.nome}</span>
                </div>
                <div className="w-1/5">
                  {product.categoria_nome || "Sem categoria"}
                </div>
                <div className="w-1/6">{formatPrice(product.preco)}</div>
                <div className="w-1/6">{product.status || "Ativo"}</div>
                <div className="flex justify-end gap-3 w-1/12">
                  <button
                    className="hover:scale-110 transition-transform"
                    onClick={() => openEditModal(product)}
                  >
                    <img
                      src="/images/edit_icon.png"
                      alt="Editar"
                      className="w-6 h-6"
                    />
                  </button>
                  <button
                    className="hover:scale-110 transition-transform"
                    onClick={() => handleDelete(product.id)}
                  >
                    <img
                      src="/images/delete_icon.png"
                      alt="Excluir"
                      className="w-6 h-6"
                    />
                  </button>
                </div>
              </div>

              {/* Mobile layout */}
              <div className="flex flex-col md:hidden w-full">
                <div className="flex justify-between">
                  <div className="flex flex-col flex-1 gap-2">
                    <div className="flex gap-x-1">
                      <span className="font-semibold">Nome:</span>
                      <span>{product.nome}</span>
                    </div>
                    <div className="flex gap-x-1">
                      <span className="font-semibold">Categoria:</span>
                      <span>{product.categoria_nome || "Sem categoria"}</span>
                    </div>
                    <div className="flex gap-x-1">
                      <span className="font-semibold">Preço:</span>
                      <span>{formatPrice(product.preco)}</span>
                    </div>
                  </div>

                  <div className="w-24 h-24 flex-shrink-0 ml-4">
                    <img
                      src={
                        product.midias?.[0]?.url || "/images/placeholder.png"
                      }
                      alt={product.nome}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </div>

                {/* Status e Ações */}
                <div className="flex justify-between mt-4 items-center">
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    {product.status || "Ativo"}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="hover:scale-110 transition-transform"
                      onClick={() => openEditModal(product)}
                    >
                      <img
                        src="/images/edit_icon.png"
                        alt="Editar"
                        className="w-6 h-6"
                      />
                    </button>
                    <button
                      className="hover:scale-110 transition-transform"
                      onClick={() => handleDelete(product.id)}
                    >
                      <img
                        src="/images/delete_icon.png"
                        alt="Excluir"
                        className="w-6 h-6 cursor-pointer"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {products.length === 0 && (
        <p className="mt-4 text-gray-500 text-center py-8">
          Nenhum produto cadastrado ainda.
        </p>
      )}

      {/* Modal de Edição */}
      {isEditModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Editar Produto</h2>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoria
                </label>
                <select
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preço</label>
                <input
                  type="text"
                  name="preco"
                  value={formData.preco}
                  onChange={handlePriceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
                  rows={4}
                />
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-100 cursor-pointer hover:scale-102 transition-transform duration-300 ease-in-out"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#45A62D] text-white rounded-2xl hover:bg-green-600 cursor-pointer hover:scale-102 transition-transform duration-300 ease-in-out"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProducts;
