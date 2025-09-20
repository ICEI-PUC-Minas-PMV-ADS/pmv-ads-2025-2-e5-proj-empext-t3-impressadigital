"use client";

import React from "react";

const EditarPerfil: React.FC = () => {
  return (
    <div className="flex justify-center">
      <div className="bg-white p-15 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">Editar Cadastro</h1>
        <p className="text-gray-500 text-center text-sm mt-1">É rápido e fácil!</p>

        <form className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Nome de usuário"
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
          />

          <input
            type="date"
            placeholder="Data de nascimento"
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
          />

          <input
            type="text"
            placeholder="CPF"
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
          />

          <input
            type="email"
            placeholder="E-mail"
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
          />

          <input
            type="text"
            placeholder="Endereço"
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
          />

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-10 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfil;
