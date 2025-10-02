"use client";

import React, { useState, useEffect } from "react";

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

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  onClose,
}) => {
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

  const [statusFiltro, setStatusFiltro] = useState<string>("todos");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todos");
  const [nomeFiltro, setNomeFiltro] = useState<string>("");
  const [itensPorPagina, setItensPorPagina] = useState<number>(10);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [productsFiltrados, setProductsFiltrados] = useState<Product[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    categoria_id: "",
    descricao: "",
    status: "",
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [products, statusFiltro, categoriaFiltro, nomeFiltro]);

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
      showToast(
        err instanceof Error ? err.message : "Erro desconhecido",
        "error"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtrados = [...products];
    if (statusFiltro !== "todos")
      filtrados = filtrados.filter((p) => p.status === statusFiltro);
    if (categoriaFiltro !== "todos")
      filtrados = filtrados.filter(
        (p) => p.categoria_id === Number(categoriaFiltro)
      );
    if (nomeFiltro.trim() !== "")
      filtrados = filtrados.filter((p) =>
        p.nome.toLowerCase().includes(nomeFiltro.toLowerCase())
      );

    setProductsFiltrados(filtrados);
    setPaginaAtual(1);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  const confirmDeleteProduct = (product: Product) =>
    setProductToDelete(product);

  const handleDeleteConfirmed = async () => {
    if (!productToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:3000/products/${productToDelete.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Erro ao excluir produto");
      showToast("Produto excluído com sucesso!", "success");
      fetchData();
    } catch (err) {
      showToast("Erro ao excluir produto", "error");
      console.error(err);
    } finally {
      setProductToDelete(null);
    }
  };

  const reloadProductData = async (productId: number) => {
    try {
      console.log(`Recarregando produto ID: ${productId}`);
      const response = await fetch(
        `http://localhost:3000/products/${productId}`
      );

      if (response.ok) {
        const updatedProduct = await response.json();

        const enrichedProduct = {
          ...updatedProduct,
          categoria_nome: categories.find(
            (cat: Category) => cat.id === updatedProduct.categoria_id
          )?.nome,
          status: updatedProduct.status === "inativo" ? "Inativo" : "Ativo",
        };

        setEditingProduct(enrichedProduct);
        setPreviews(enrichedProduct.midias?.map((m: any) => m.url) || []);
        return enrichedProduct;
      } else {
        const errorText = await response.text();
        console.error("Erro ao recarregar produto:", errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error("Erro ao recarregar dados do produto:", error);
      throw error;
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nome: product.nome,
      preco: product.preco.toString(),
      categoria_id: product.categoria_id.toString(),
      descricao: product.descricao || "",
      status: product.status || "Ativo",
    });
    setPreviews(product.midias?.map((m) => m.url) || []);
    setFiles([]);
    setSelectedImageIndex(0);
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
      status: "",
    });
    setPreviews([]);
    setFiles([]);
    setSelectedImageIndex(0);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    const newFiles = Array.from(selectedFiles);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = async (index: number) => {
    if (editingProduct?.midias?.[index]?.id) {
      const mediaId = editingProduct.midias[index].id;

      try {
        const res = await fetch(`http://localhost:3000/midias/${mediaId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Erro na resposta:", errorText);
          throw new Error(
            `Erro ao excluir imagem: ${res.status} ${res.statusText}`
          );
        }

        showToast("Imagem excluída com sucesso", "success");

        if (editingProduct) {
          await reloadProductData(editingProduct.id);
        }
      } catch (err) {
        console.error("💥 Erro detalhado:", err);
        showToast("Erro ao excluir imagem", "error");
        return;
      }
    } else {
      // Remover imagens do estado local que não estão salvas no banco
      setFiles((prev) => prev.filter((_, i) => i !== index));
      setPreviews((prev) => {
        const removed = prev[index];
        URL.revokeObjectURL(removed);
        return prev.filter((_, i) => i !== index);
      });

      if (selectedImageIndex >= previews.length - 1) {
        setSelectedImageIndex(0);
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
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
            status: formData.status.toLowerCase(),
          }),
        }
      );
      if (!response.ok) throw new Error("Erro ao atualizar produto");

      if (files.length > 0) {
        const formDataUpload = new FormData();
        files.forEach((file) => formDataUpload.append("files", file));
        formDataUpload.append("produto_id", editingProduct.id.toString());
        const uploadRes = await fetch("http://localhost:3000/midias/upload", {
          method: "POST",
          body: formDataUpload,
        });
        if (!uploadRes.ok) throw new Error("Erro ao enviar imagens");
      }

      showToast("Produto atualizado com sucesso!", "success");
      closeEditModal();
      fetchData();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Erro ao atualizar produto",
        "error"
      );
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Carregando...</div>
    );

  // Paginação
  const totalPaginas = Math.ceil(productsFiltrados.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const produtosPagina = productsFiltrados.slice(
    indiceInicio,
    indiceInicio + itensPorPagina
  );

  const gerarNumerosPagina = () => {
    const maxNumeros = 5;
    let inicio = Math.max(1, paginaAtual - 2);
    let fim = Math.min(totalPaginas, inicio + maxNumeros - 1);
    if (fim - inicio < maxNumeros - 1)
      inicio = Math.max(1, fim - maxNumeros + 1);
    const numeros = [];
    for (let i = inicio; i <= fim; i++) numeros.push(i);
    return numeros;
  };

  return (
    <div className="w-full bg-white p-6 text-black">
      <p className="text-xl lg:text-2xl font-bold">Produtos</p>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mt-4 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 items-end">
        {/* Status */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Status</label>
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="border rounded px-3 py-1 text-sm text-black focus:border-green-500 cursor-pointer"
          >
            <option value="todos">Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Categoria</label>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="border rounded px-3 py-1 text-sm text-black focus:border-green-500 cursor-pointer"
          >
            <option value="todos">Todas</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Nome</label>
          <input
            type="text"
            placeholder="Pesquisar produto"
            value={nomeFiltro}
            onChange={(e) => setNomeFiltro(e.target.value)}
            className="border rounded px-3 py-1 text-sm text-black focus:border-green-500"
          />
        </div>

        {/* Itens por página */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Itens por página
          </label>
          <select
            value={itensPorPagina}
            onChange={(e) => setItensPorPagina(Number(e.target.value))}
            className="border rounded px-3 py-1 text-sm text-black focus:border-green-500 cursor-pointer"
          >
            {[5, 10, 20, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de produtos */}
      <div className="mt-6 w-full">
        <div className="bg-white rounded-lg shadow p-4 items-center font-semibold hidden md:flex">
          <div className="flex items-center gap-4 w-3/5">Nome / Imagem</div>
          <div className="w-1/5">Categoria</div>
          <div className="w-1/6">Preço</div>
          <div className="w-1/6">Status</div>
          <div className="flex justify-end gap-3 w-1/12">Ações</div>
        </div>

        <ul className="space-y-4 mt-2">
          {produtosPagina.map((product) => (
            <li
              key={product.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
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
                <div className="w-1/5">
                  {product.categoria_nome || "Sem categoria"}
                </div>
                <div className="w-1/6">{formatPrice(product.preco)}</div>
                <div className="w-1/6">{product.status || "Ativo"}</div>
                <div className="flex justify-end gap-3 w-1/12">
                  <button
                    onClick={() => openEditModal(product)}
                    className="hover:scale-110 transition-transform"
                  >
                    <img
                      src="/images/edit_icon.png"
                      alt="Editar"
                      className="w-6 h-6"
                    />
                  </button>
                  <button
                    onClick={() => confirmDeleteProduct(product)}
                    className="hover:scale-110 transition-transform"
                  >
                    <img
                      src="/images/delete_icon.png"
                      alt="Excluir"
                      className="w-6 h-6"
                    />
                  </button>
                </div>
              </div>

              {/* Mobile */}
              <div className="flex flex-col md:hidden w-full">
                <div className="flex justify-between">
                  <div className="flex flex-col flex-1 gap-2">
                    <div className="flex gap-x-1">
                      <span className="font-semibold">Nome:</span>{" "}
                      <span>{product.nome}</span>
                    </div>
                    <div className="flex gap-x-1">
                      <span className="font-semibold">Categoria:</span>{" "}
                      <span>{product.categoria_nome || "Sem categoria"}</span>
                    </div>
                    <div className="flex gap-x-1">
                      <span className="font-semibold">Preço:</span>{" "}
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
                <div className="flex justify-between mt-4 items-center">
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    {product.status || "Ativo"}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="hover:scale-110 transition-transform"
                    >
                      <img
                        src="/images/edit_icon.png"
                        alt="Editar"
                        className="w-6 h-6"
                      />
                    </button>
                    <button
                      onClick={() => confirmDeleteProduct(product)}
                      className="hover:scale-110 transition-transform"
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

      {productsFiltrados.length === 0 && (
        <p className="mt-4 text-gray-500 text-center py-8">
          Nenhum produto encontrado.
        </p>
      )}

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-center mt-4 gap-1 items-center flex-wrap text-black text-sm">
          <button
            onClick={() => setPaginaAtual((p) => Math.max(1, paginaAtual - 1))}
            disabled={paginaAtual === 1}
            className={`px-1.5 py-0.5 border rounded ${
              paginaAtual === 1
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 hover:bg-gray-100 cursor-pointer"
            }`}
          >
            &lt;
          </button>
          {gerarNumerosPagina().map((num) => (
            <button
              key={num}
              onClick={() => setPaginaAtual(num)}
              className={`px-2 py-0.5 border rounded ${
                num === paginaAtual
                  ? "bg-green-500 text-white border-gray-300 cursor-pointer"
                  : "border-gray-300 hover:bg-gray-100 text-gray-700 cursor-pointer"
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() =>
              setPaginaAtual((p) => Math.min(totalPaginas, paginaAtual + 1))
            }
            disabled={paginaAtual === totalPaginas}
            className={`px-1.5 py-0.5 border rounded ${
              paginaAtual === totalPaginas
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 hover:bg-gray-100 cursor-pointer"
            }`}
          >
            &gt;
          </button>
        </div>
      )}

      {/* MODAL DE EDIÇÃO */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-4">
            <div className="flex flex-col md:w-1/3 gap-4">
              <h3 className="font-semibold">Imagens</h3>

              {/* Imagem principal */}
              {previews.length > 0 && (
                <img
                  src={previews[selectedImageIndex]}
                  alt={`preview principal`}
                  className="w-full h-64 object-cover rounded-lg mb-2"
                />
              )}

              <div className="flex gap-2 overflow-x-auto">
                {previews.map((url, idx) => (
                  <div key={idx} className="relative flex-shrink-0">
                    <img
                      src={url}
                      alt={`preview ${idx}`}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                        selectedImageIndex === idx
                          ? "border-green-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <label className="mt-2 px-4 py-2 bg-green-600 text-white rounded-2xl cursor-pointer hover:bg-green-700 text-center text-sm">
                Adicionar imagens
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* FORMULÁRIO */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Editar Produto</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-[#45A62D] hover:scale-105 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
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
                  <label className="block text-sm font-medium mb-1">
                    Preço
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
                    required
                  >
                    <option value="">Selecione o status</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#45A62D] text-white rounded-2xl hover:bg-green-600"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EXCLUSÃO */}
      {productToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Confirmar exclusão</h2>
            <p className="mb-6">
              Tem certeza que deseja excluir o produto{" "}
              <strong>{productToDelete.nome}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default DashboardProducts;
