"use client";

export default function CardSimples() {
  return (
   <div className="flex justify-center mt-10 bg-gray-100">
  <div className="w-full max-w-sm bg-green-100 border border-green-300 rounded-lg shadow-sm dark:bg-green-800 dark:border-green-700">
    <a href="#">
      <img
        className="p-8 rounded-t-lg"
        src="https://img.energiabrindes.com.br/isbc/caderno-escolar-personalizado_st-cad-esc.jp2"
        alt="product image"
      />
    </a>
    <div className="px-5 pb-5 text-center">
      <a href="#">
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mt-4">
          Caderno Tilibra é um caderno de alta qualidade, com capas resistentes e folhas bem acabadas.
        </h5>
      </a>
      <div className="flex items-center justify-center mt-2.5 mb-5">
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          {/* Aqui entram os SVGs das estrelas */}
        </div>
        {/* <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">
          5.0
        </span> */}
      </div>
      <div className="flex items-center justify-center gap-4">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">R$7,99</span>
        <a
          href="#"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Adicionar no carrinho
        </a>
      </div>
    </div>
  </div>
</div>

  );
}
