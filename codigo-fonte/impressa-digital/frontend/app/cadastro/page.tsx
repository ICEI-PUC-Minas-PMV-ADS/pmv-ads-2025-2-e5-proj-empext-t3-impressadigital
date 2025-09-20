"use client";

import Image from "next/image";

export default function Cadastro() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/images/logo_impressa_digital.png"
            alt="Logo"
            width={180}
            height={80}
            className="mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-800">Criar uma conta</h1>
          <p className="text-gray-500 text-sm mt-1">É rápido e fácil!</p>
        </div>

        {/* Formulário */}
        <form className="space-y-4">
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
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
          />

          {/* Termos e condições */}
          <p className="text-xs text-gray-400 leading-snug">
            As pessoas que usam nosso serviço podem ter carregado suas informações de contato na
            Impressa Digital. Saiba mais. <br />
            Ao clicar em Cadastre-se, você concorda com nossos Termos, Política de Privacidade e
            Política de Cookies. Você poderá receber notificações por SMS e cancelar isso quando quiser.
          </p>

          {/* Botão */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md"
          >
            Cadastre-se
          </button>
        </form>
      </div>
    </div>
  );
}
