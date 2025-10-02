"use client";

import { useState, useEffect } from "react";

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  produtos?: any[];
}

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

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Categoria | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: ""
  });

  const [filtroNome, setFiltroNome] = useState("");
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [categorias, filtroNome]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [itensPorPagina]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/categories");
      if (!response.ok) throw new Error("Erro ao carregar categorias");
      const data = await response.json();
      setCategorias(data);
    } catch (err) {
      setError("Erro ao carregar categorias");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtradas = [...categorias];
    
    if (filtroNome.trim() !== "") {
      filtradas = filtradas.filter(cat =>
        cat.nome.toLowerCase().includes(filtroNome.toLowerCase())
      );
    }

    setCategoriasFiltradas(filtradas);
    setPaginaAtual(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      alert("Nome da categoria é obrigatório");
      return;
    }

    try {
      if (editingCategory) {
        const response = await fetch(`http://localhost:3000/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) throw new Error("Erro ao atualizar categoria");
        
        setCategorias(prev =>
          prev.map(cat =>
            cat.id === editingCategory.id ? { ...cat, ...formData } : cat
          )
        );
        
        showToast("Categoria atualizada com sucesso!", "success");
      } else {
        const response = await fetch("http://localhost:3000/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) throw new Error("Erro ao criar categoria");
        
        const novaCategoria = await response.json();
        setCategorias(prev => [...prev, novaCategoria]);
        showToast("Categoria criada com sucesso!", "success");
      }

      closeModal();
    } catch (err) {
      showToast("Erro ao salvar categoria", "error");
      console.error(err);
    }
  };

  const openModal = (categoria?: Categoria) => {
    if (categoria) {
      setEditingCategory(categoria);
      setFormData({
        nome: categoria.nome,
        descricao: categoria.descricao || ""
      });
    } else {
      setEditingCategory(null);
      setFormData({ nome: "", descricao: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ nome: "", descricao: "" });
  };

  const confirmDelete = (categoria: Categoria) => {
    setCategoryToDelete(categoria);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Erro ao excluir categoria");
      
      setCategorias(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
      showToast("Categoria excluída com sucesso!", "success");
    } catch (err) {
      showToast("Erro ao excluir categoria", "error");
      console.error(err);
    } finally {
      setCategoryToDelete(null);
    }
  };

  const contarProdutos = (categoria: Categoria) => {
    return categoria.produtos?.length || 0;
  };

  if (loading)
    return <div className="p-6 text-center">Carregando categorias...</div>;
  
  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        {error}
        <button
          onClick={fetchData}
          className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Tentar novamente
        </button>
      </div>
    );

  // Paginação
  const totalPaginas = Math.ceil(categoriasFiltradas.length / itensPorPagina);
  const paginaValida = Math.min(paginaAtual, totalPaginas || 1);
  const indiceInicio = (paginaValida - 1) * itensPorPagina;
  const categoriasPagina = categoriasFiltradas.slice(
    indiceInicio,
    indiceInicio + itensPorPagina
  );

  const gerarNumerosPagina = () => {
    const maxNumeros = 5;
    let inicio = Math.max(1, paginaValida - 2);
    let fim = Math.min(totalPaginas, inicio + maxNumeros - 1);
    
    if (fim - inicio < maxNumeros - 1) {
      inicio = Math.max(1, fim - maxNumeros + 1);
    }
    
    const numeros = [];
    for (let i = inicio; i <= fim; i++) numeros.push(i);
    return numeros;
  };

  return (
    <div className="p-6">
      <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">
        Gerenciar Categorias
      </h1>

      {/* Botão de adicionar e filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 text-black">
        <button
          onClick={() => openModal()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700  cursor-pointer"
        >
          Nova Categoria
        </button>

        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Filtrar por nome
            </label>
            <input
              type="text"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              placeholder="Digite para filtrar..."
              className="border rounded px-3 py-2 text-sm text-black focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Itens por página
            </label>
            <select
              value={itensPorPagina}
              onChange={(e) => setItensPorPagina(Number(e.target.value))}
              className="border rounded px-3 py-2 text-sm text-black focus:border-green-500 cursor-pointer"
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="flex flex-col gap-3">
        {categoriasPagina.map((categoria) => (
          <div
            key={categoria.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div className="flex flex-col gap-1 text-sm text-gray-700">
              <span className="font-semibold text-lg">#{categoria.id} - {categoria.nome}</span>
              <span>
                <strong>Descrição:</strong> {categoria.descricao || "Sem descrição"}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full w-fit ${
                contarProdutos(categoria) > 0 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {contarProdutos(categoria)} produto(s) vinculado(s)
              </span>
            </div>

            <div className="flex gap-2 mt-3 md:mt-0">
              <button
                onClick={() => openModal(categoria)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm cursor-pointer"
              >
                Editar
              </button>
              <button
                onClick={() => confirmDelete(categoria)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-center mt-4 gap-1 items-center flex-wrap text-black text-sm">
          <button
            onClick={() => setPaginaAtual((p) => Math.max(1, paginaValida - 1))}
            disabled={paginaValida === 1}
            className={`px-1.5 py-0.5 border rounded ${
              paginaValida === 1
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
                num === paginaValida
                  ? "bg-green-500 text-white border-gray-300 cursor-pointer"
                  : "border-gray-300 hover:bg-gray-100 text-gray-700 cursor-pointer"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() =>
              setPaginaAtual((p) => Math.min(totalPaginas, paginaValida + 1))
            }
            disabled={paginaValida === totalPaginas}
            className={`px-1.5 py-0.5 border rounded ${
              paginaValida === totalPaginas
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 hover:bg-gray-100 cursor-pointer"
            }`}
          >
            &gt;
          </button>
        </div>
      )}

      {categoriasFiltradas.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📂</div>
          <div className="text-lg">Nenhuma categoria encontrada</div>
          <div className="text-sm mt-2">
            {categorias.length === 0 
              ? "Comece criando sua primeira categoria!" 
              : "Tente ajustar os filtros."}
          </div>
        </div>
      )}

      {/* Modal de Edição/Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 cursor-pointer"
                >
                  {editingCategory ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação */}
      {categoryToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Confirmar exclusão</h2>
            <p className="mb-6">
              Tem certeza que deseja excluir a categoria{" "}
              <strong>{categoryToDelete.nome}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}