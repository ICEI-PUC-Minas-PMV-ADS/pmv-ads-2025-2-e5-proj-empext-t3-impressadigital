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
  midias?: Array<{ id: number; url: string }>;
  status?: string;
}

interface Category {
  id: number;
  nome: string;
}

// Componente Toast
interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}
const Toast: React.FC<ToastProps> = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 text-white ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
};

const DashboardProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    categoria_id: "",
    descricao: "",
    status: "",
  });

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
  };

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

      const enrichedProducts = productsData.map((product: Product) => ({
        ...product,
        categoria_nome: categoriesData.find(
          (cat: Category) => cat.id === product.categoria_id
        )?.nome,
        status: product.status === "inativo" ? "Inativo" : "Ativo",
      }));

      setProducts(enrichedProducts);
      setCategories(categoriesData);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Erro desconhecido", "error");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  const confirmDelete = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      const response = await fetch(
        `http://localhost:3000/products/${deletingProduct.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Erro ao excluir produto");

      showToast("Produto excluído com sucesso!", "success");
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
      fetchData();
    } catch (err) {
      showToast("Erro ao excluir produto", "error");
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
      status: product.status || "ativo",
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setFormData({ nome: "", preco: "", categoria_id: "", descricao: "", status: "" });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\./g, ",").replace(/[^0-9,]/g, "");
    const parts = value.split(",");
    if (parts.length > 2) value = parts[0] + "," + parts[1];
    if (parts[1]?.length > 2) value = parts[0] + "," + parts[1].slice(0, 2);
    setFormData((prev) => ({ ...prev, preco: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const precoNumerico = parseFloat(formData.preco.replace(",", "."));
      const response = await fetch(
        `http://localhost:3000/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: formData.nome,
            preco: precoNumerico,
            categoria_id: parseInt(formData.categoria_id),
            descricao: formData.descricao,
            status: formData.status,
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar produto");
      showToast("Produto atualizado com sucesso!", "success");
      closeEditModal();
      fetchData();
    } catch (err) {
      showToast("Erro ao atualizar produto", "error");
      console.error("Erro:", err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Carregando...</div>;

  return (
    <div className="w-full bg-white p-6">
      <p className="text-black text-3xl lg:text-4xl font-bold">Produtos</p>

      <div className="mt-8 w-full text-black">
        <div className="bg-white rounded-lg shadow p-4 items-center font-semibold hidden md:flex">
          <div className="flex items-center gap-4 w-3/5">Nome / Imagem</div>
          <div className="w-1/5">Categoria</div>
          <div className="w-1/6">Preço</div>
          <div className="w-1/6">Status</div>
          <div className="flex justify-end gap-3 w-1/12">Ações</div>
        </div>

        <ul className="space-y-4 mt-2">
          {products.map((product) => (
            <li key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              {/* Desktop */}
              <div className="hidden md:flex w-full items-center justify-between">
                <div className="flex items-center gap-4 w-3/5">
                  <img
                    src={product.midias?.[0]?.url || "/images/placeholder.png"}
                    alt={product.nome}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span className="font-semibold">{product.nome}</span>
                </div>
                <div className="w-1/5">{product.categoria_nome || "Sem categoria"}</div>
                <div className="w-1/6">{formatPrice(product.preco)}</div>
                <div className="w-1/6">{product.status || "Ativo"}</div>
                <div className="flex justify-end gap-3 w-1/12">
                  <button className="hover:scale-110 transition-transform" onClick={() => openEditModal(product)}>
                    <img src="/images/edit_icon.png" alt="Editar" className="w-6 h-6" />
                  </button>
                  <button className="hover:scale-110 transition-transform" onClick={() => confirmDelete(product)}>
                    <img src="/images/delete_icon.png" alt="Excluir" className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Mobile */}
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
                    <img src={product.midias?.[0]?.url || "/images/placeholder.png"} alt={product.nome} className="w-full h-full object-cover rounded" />
                  </div>
                </div>
                <div className="flex justify-between mt-4 items-center">
                  <div>
                    <span className="font-semibold">Status:</span> {product.status || "Ativo"}
                  </div>
                  <div className="flex gap-2">
                    <button className="hover:scale-110 transition-transform" onClick={() => openEditModal(product)}>
                      <img src="/images/edit_icon.png" alt="Editar" className="w-6 h-6" />
                    </button>
                    <button className="hover:scale-110 transition-transform" onClick={() => confirmDelete(product)}>
                      <img src="/images/delete_icon.png" alt="Excluir" className="w-6 h-6 cursor-pointer" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {products.length === 0 && <p className="mt-4 text-gray-500 text-center py-8">Nenhum produto cadastrado ainda.</p>}

      {/* Modais */}
      {isDeleteModalOpen && deletingProduct && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Confirmar Exclusão</h2>
            <p>
              Tem certeza que deseja excluir o produto <span className="font-semibold">{deletingProduct.nome}</span>?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-100 cursor-pointer hover:scale-102">Cancelar</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 cursor-pointer hover:scale-102">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Editar Produto</h2>
              <button onClick={closeEditModal} className="text-gray-500 hover:text-[#45A62D] hover:scale-105 cursor-pointer">✕</button>
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

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
                  required
                >
                  <option value="">Selecione o status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
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

      {/* Toast */}
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default DashboardProducts;
