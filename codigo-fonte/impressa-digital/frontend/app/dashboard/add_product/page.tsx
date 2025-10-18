"use client";

import React, { useState, useEffect } from "react";

interface Categoria {
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

const DashboardAddProduct: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [peso, setPeso] = useState("");
  const [largura, setLargura] = useState("");
  const [altura, setAltura] = useState("");
  const [comprimento, setComprimento] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

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
    const fetchCategorias = async () => {
      try {
        setLoadingCategorias(true);
        const response = await fetch("http://localhost:3000/categories");

        if (!response.ok) {
          throw new Error("Erro ao carregar categorias");
        }

        const categoriasData = await response.json();
        setCategorias(categoriasData);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        showToast("Erro ao carregar categorias. Tente novamente.", "error");
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setFiles((prev) => [...prev, ...newFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed);
      return prev.filter((_, i) => i !== index);
    });
  };

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (!categoriaId) {
      showToast("Selecione uma categoria.", "error");
      setIsLoading(false);
      return;
    }

    if (!nome.trim()) {
      showToast("O nome do produto é obrigatório.", "error");
      setIsLoading(false);
      return;
    }

    // Validação dos campos de frete
    if (!peso || parseFloat(peso) <= 0) {
      showToast("Informe o peso do produto corretamente.", "error");
      setIsLoading(false);
      return;
    }

    if (!largura || parseFloat(largura) <= 0) {
      showToast("Informe a largura do produto corretamente.", "error");
      setIsLoading(false);
      return;
    }

    if (!altura || parseFloat(altura) <= 0) {
      showToast("Informe a altura do produto corretamente.", "error");
      setIsLoading(false);
      return;
    }

    if (!comprimento || parseFloat(comprimento) <= 0) {
      showToast("Informe o comprimento do produto corretamente.", "error");
      setIsLoading(false);
      return;
    }

    try {
      // Criar o produto
      const produtoRes = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          descricao,
          preco: parseFloat(preco.replace(",", ".")),
          categoria_id: categoriaId,
          status,
          peso: parseFloat(peso),
          largura: parseFloat(largura),
          altura: parseFloat(altura),
          comprimento: parseFloat(comprimento),
        }),
      });

      if (!produtoRes.ok) {
        const errorData = await produtoRes.json();
        throw new Error(errorData.message || "Erro ao salvar produto");
      }

      const produtoData = await produtoRes.json();
      const produtoId = produtoData.id;

      // Upload das imagens para o Cloudinary
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        formData.append("produto_id", produtoId.toString());

        const midiasRes = await fetch(
          `http://localhost:3000/midias/produtos/${produtoId}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!midiasRes.ok) {
          const errorData = await midiasRes.json();
          throw new Error(
            errorData.message || "Erro ao fazer upload das imagens"
          );
        }

        const midiasData = await midiasRes.json();
        console.log("Mídias salvas:", midiasData);
      }

      showToast("Produto adicionado com sucesso!", "success");

      // Limpar o formulário
      setNome("");
      setDescricao("");
      setPreco("");
      setCategoriaId(null);
      setStatus("");
      setPeso("");
      setLargura("");
      setAltura("");
      setComprimento("");
      setFiles([]);
      setPreviews([]);
    } catch (err: any) {
      console.error("Erro completo:", err);
      showToast(
        err.message || "Erro ao salvar produto ou fazer upload das imagens.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <p className="text-black text-xl lg:text-2xl font-bold mb-6">
        Adicionar produto
      </p>

      <div className="border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
        <p className="text-black font-sans font-bold mb-4 text-xl">
          Informe os detalhes do produto
        </p>

        <form
          className="flex flex-col gap-4 text-black font-sans"
          onSubmit={handleSubmit}
        >
          {/* Categoria */}
          <select
            value={categoriaId ?? ""}
            onChange={(e) => setCategoriaId(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
            required
            disabled={loadingCategorias}
          >
            <option value="">
              {loadingCategorias
                ? "Carregando categorias..."
                : "Selecione a categoria"}
            </option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>

          {/* Nome do produto */}
          <input
            type="text"
            placeholder="Nome do produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
            required
          />

          {/* Campos de peso e dimensões */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Peso (kg)"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
              required
            />

            <input
              type="number"
              min="0.1"
              step="0.1"
              placeholder="Largura (cm)"
              value={largura}
              onChange={(e) => setLargura(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
              required
            />

            <input
              type="number"
              min="0.1"
              step="0.1"
              placeholder="Altura (cm)"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
              required
            />

            <input
              type="number"
              min="0.1"
              step="0.1"
              placeholder="Comprimento (cm)"
              value={comprimento}
              onChange={(e) => setComprimento(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
              required
            />
          </div>

          {/* Upload de fotos */}
          <div className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus-within:ring-1 focus-within:ring-[#45A62D]">
            <label
              htmlFor="fileUpload"
              className="px-4 py-2 rounded-2xl bg-[#45A62D] text-white font-semibold cursor-pointer w-fit"
            >
              Escolher imagens
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Preview das imagens */}
            {previews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Pré-visualizações:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {previews.map((src, index) => (
                    <div key={index} className="relative w-32 h-32 group">
                      <img
                        src={src}
                        alt={`Pré-visualização ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-2xl border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-[#45A62D] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 transition cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Descrição */}
          <textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
            rows={4}
          />

          {/* Status do Produto */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
            required
          >
            <option value="">Selecione o status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>

          {/* Valor */}
          <input
            type="text"
            inputMode="decimal"
            placeholder="Valor"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#45A62D]"
            required
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              let value = target.value.replace(/\./g, ",");
              value = value.replace(/[^0-9,]/g, "");
              const parts = value.split(",");
              if (parts.length > 2) {
                value = parts[0] + "," + parts[1];
              }
              if (parts[1]?.length > 2) {
                value = parts[0] + "," + parts[1].slice(0, 2);
              }
              target.value = value;
              setPreco(value);
            }}
          />

          <button
            type="submit"
            disabled={isLoading || loadingCategorias}
            className={`mt-4 px-6 py-2 bg-[#45A62D] text-white font-semibold rounded-2xl transition w-50 cursor-pointer ${
              isLoading || loadingCategorias
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#3a8a24]"
            }`}
          >
            {isLoading ? "Salvando..." : "Salvar produto"}
          </button>
        </form>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
};

export default DashboardAddProduct;
