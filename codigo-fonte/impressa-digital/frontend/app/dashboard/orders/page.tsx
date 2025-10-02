"use client";

import { useState, useEffect } from "react";

interface Venda {
  id: number;
  status: "pendente" | "confirmado" | "cancelado";
  data_venda: string;
  valor_total: number;
  observacoes: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Venda[]>([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [atualizando, setAtualizando] = useState<number | null>(null);
  const [atualizandoLista, setAtualizandoLista] = useState(false);

  const [statusFiltro, setStatusFiltro] = useState<string>("todos");
  const [clienteFiltro, setClienteFiltro] = useState<string>("");
  const [idFiltro, setIdFiltro] = useState<string>("");
  const [ordemData, setOrdemData] = useState<"asc" | "desc">("desc");

  const [itensPorPagina, setItensPorPagina] = useState<number>(10);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);

  useEffect(() => {
    carregarPedidos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [pedidos, statusFiltro, clienteFiltro, idFiltro, ordemData]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [itensPorPagina]);

  const carregarPedidos = async () => {
    try {
      const response = await fetch("http://localhost:3000/vendas");
      if (!response.ok) throw new Error("Erro ao carregar pedidos");
      const data = await response.json();
      setPedidos(data);
    } catch (err) {
      setError("Erro ao carregar pedidos");
      console.error(err);
    } finally {
      setLoading(false);
      setAtualizandoLista(false);
    }
  };

  const atualizarLista = async () => {
    setAtualizandoLista(true);
    await carregarPedidos();
  };

  const aplicarFiltros = () => {
    let filtrados = [...pedidos];
    
    if (statusFiltro !== "todos") {
      filtrados = filtrados.filter((p) => p.status === statusFiltro);
    }
    
    if (clienteFiltro.trim() !== "") {
      filtrados = filtrados.filter(
        (p) =>
          p.user?.name?.toLowerCase().includes(clienteFiltro.toLowerCase()) ||
          p.user?.email?.toLowerCase().includes(clienteFiltro.toLowerCase())
      );
    }
    
    if (idFiltro.trim() !== "") {
      const idNumero = parseInt(idFiltro);
      if (!isNaN(idNumero)) {
        filtrados = filtrados.filter((p) => p.id === idNumero);
      }
    }
    
    filtrados.sort((a, b) => {
      const dataA = new Date(a.data_venda).getTime();
      const dataB = new Date(b.data_venda).getTime();
      return ordemData === "asc" ? dataA - dataB : dataB - dataA;
    });
    
    setPedidosFiltrados(filtrados);
    setPaginaAtual(1); 
  };

  const atualizarStatus = async (id: number, novoStatus: string) => {
    setAtualizando(id);
    try {
      const response = await fetch(`http://localhost:3000/vendas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (!response.ok) throw new Error("Erro ao atualizar status");
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.id === id ? { ...pedido, status: novoStatus as any } : pedido
        )
      );
    } catch (err) {
      setError("Erro ao atualizar status");
      console.error(err);
    } finally {
      setAtualizando(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-100 text-green-800 border border-green-200";
      case "cancelado":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmado":
        return "Confirmado";
      case "cancelado":
        return "Cancelado";
      default:
        return "Pendente";
    }
  };

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  if (loading)
    return <div className="p-6 text-center">Carregando pedidos...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        {error}
        <button
          onClick={carregarPedidos}
          className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Tentar novamente
        </button>
      </div>
    );

  const totalPaginas = Math.ceil(pedidosFiltrados.length / itensPorPagina);
  const paginaValida = Math.min(paginaAtual, totalPaginas || 1);
  const indiceInicio = (paginaValida - 1) * itensPorPagina;
  const pedidosPagina = pedidosFiltrados.slice(
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
        Gerenciar Pedidos
      </h1>

      {/* Filtros */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Filtro por ID */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">ID do Pedido</label>
            <input
              type="number"
              value={idFiltro}
              onChange={(e) => setIdFiltro(e.target.value)}
              placeholder="Digite o ID"
              min="1"
              className="border rounded px-3 py-2 text-sm text-black focus:border-green-500 w-32"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="border rounded px-3 py-2 text-sm text-black focus:border-green-500 cursor-pointer"
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="confirmado">Confirmado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Cliente</label>
            <input
              type="text"
              value={clienteFiltro}
              onChange={(e) => setClienteFiltro(e.target.value)}
              placeholder="Nome ou e-mail"
              className="border rounded px-3 py-2 text-sm text-black focus:border-green-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Ordenar por Data
            </label>
            <select
              value={ordemData}
              onChange={(e) => setOrdemData(e.target.value as "asc" | "desc")}
              className="border rounded px-3 py-2 text-sm text-black focus:border-green-500 cursor-pointer"
            >
              <option value="asc">Crescente</option>
              <option value="desc">Decrescente</option>
            </select>
          </div>

          {/* Itens por página */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Itens por página
            </label>
            <select
              value={itensPorPagina}
              onChange={(e) => setItensPorPagina(Number(e.target.value))}
              className="border rounded px-3 py-2 text-sm text-black focus:border-green-500 cursor-pointer"
            >
              {[5, 10, 20, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botão de atualizar */}
        <div className="flex-shrink-0">
          <button
            onClick={atualizarLista}
            disabled={atualizandoLista}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {atualizandoLista ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Atualizando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Atualizar Lista
              </>
            )}
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {pedidosPagina.map((pedido) => (
          <div
            key={pedido.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col md:flex-row md:justify-between"
          >
            <div className="flex flex-col gap-1 text-sm text-gray-700">
              <span className="font-semibold">#{pedido.id}</span>
              <span>
                <strong>Data:</strong> {formatarData(pedido.data_venda)}
              </span>
              <span>
                <strong>Cliente:</strong> {pedido.user?.name} (
                {pedido.user?.email})
              </span>
              <span>
                <strong>Total:</strong> {formatarMoeda(pedido.valor_total || 0)}
              </span>
              <span>
                <strong>Observações:</strong>{" "}
                {pedido.observacoes || "Sem observações"}
              </span>
            </div>

            <div className="flex flex-col items-end mt-3 md:mt-0 gap-2">
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(
                  pedido.status
                )}`}
              >
                {getStatusText(pedido.status)}
              </span>
              <select
                value={pedido.status}
                onChange={(e) => atualizarStatus(pedido.id, e.target.value)}
                disabled={atualizando === pedido.id}
                className="text-black border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-green-500 disabled:opacity-50 cursor-pointer"
              >
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </select>
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
      {pedidosFiltrados.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📦</div>
          <div className="text-lg">Nenhum pedido encontrado</div>
          <div className="text-sm mt-2">Tente ajustar os filtros.</div>
        </div>
      )}
    </div>
  );
}