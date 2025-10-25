"use client";

import { useRouter } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";

export default function AccessDenied() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[30%] w-[100%]">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-[30%] text-center flex flex-col justify-center">
        <FiAlertCircle className="text-red-600 w-16 h-16 mx-auto mb-4 animate-pulse" />
        <h1 className="text-3xl font-bold text-red-600 mb-3">
          Acesso Negado
        </h1>
        <p className="text-gray-700 mb-6">
          Você não tem permissão para acessar esta página.
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition cursor-pointer"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
