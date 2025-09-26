"use client";

import React, { useState, useEffect } from "react";

const categories = [
  { id: 1, nome: "Casamento" },
  { id: 2, nome: "Festa Infantil" },
  { id: 3, nome: "Aniversário Adulto" },
  { id: 4, nome: "Eventos Corporativos" },
  { id: 5, nome: "Formatura" },
  { id: 6, nome: "Chá de Bebê" },
  { id: 7, nome: "Eventos Esportivos" },
];

const DashboardAddProduct: React.FC = () => {
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); // 

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

  setSuccessMessage("");
  setErrorMessage("");

  if (!categoriaId) {
    setErrorMessage("Selecione uma categoria.");
    return;
  }

  if (!nome.trim()) {
    setErrorMessage("O nome do produto é obrigatório.");
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
      }),
    });

    if (!produtoRes.ok) throw new Error("Erro ao salvar produto");

    const produtoData = await produtoRes.json();
    const produtoId = produtoData.id;

    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("produto_id", produtoId.toString());

      const midiasRes = await fetch("http://localhost:3000/midias", {
        method: "POST",
        body: formData,
      });

      if (!midiasRes.ok) throw new Error("Erro ao salvar imagens");
    }

    setSuccessMessage("Produto adicionado com sucesso!");
    setErrorMessage("");

    setNome("");
    setDescricao("");
    setPreco("");
    setCategoriaId(null);
    setFiles([]);
    setPreviews([]);

    setTimeout(() => setSuccessMessage(""), 3000);
  } catch (err) {
    console.error(err);
    setErrorMessage("Erro ao salvar produto ou imagens.");
    setTimeout(() => setErrorMessage(""), 4000);
  }
};

  return (
    <>
      <p className="text-black text-4xl font-bold mb-6">Adicionar produto</p>

      <div className="border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
        <p className="text-black font-sans font-bold mb-4 text-2xl">
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
          >
            <option value="">Selecione a categoria</option>
            {categories.map((cat) => (
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
          />

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
            className="mt-4 px-6 py-2 bg-[#45A62D] text-white font-semibold rounded-2xl transition w-50 cursor-pointer"
          >
            Salvar produto
          </button>

          {successMessage && (
            <p className="mt-2 text-[#45A62D] font-semibold">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="mt-2 text-red-600 font-semibold">{errorMessage}</p>
          )}
        </form>
      </div>
    </>
  );
};

export default DashboardAddProduct;
