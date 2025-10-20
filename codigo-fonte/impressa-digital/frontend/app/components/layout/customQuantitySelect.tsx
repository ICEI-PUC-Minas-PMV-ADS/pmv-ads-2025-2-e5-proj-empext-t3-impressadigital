import React, { useState, useRef, useEffect } from 'react';

/**
 * Componente Dropdown customizado para seleção de quantidade.
 * Permite que o valor selecionado tenha um prefixo ("quantidade: "),
 * enquanto as opções do dropdown exibem apenas o número.
 *
 * @param {number} quantity - O valor numérico atual da quantidade.
 * @param {function} onChange - Função chamada quando a quantidade é alterada. Recebe o novo valor numérico.
 */
const CustomQuantitySelect = ({ quantity, onChange }) => {
  // Estado para controlar se o dropdown está aberto ou fechado
  const [isOpen, setIsOpen] = useState(false);
  // Referência para o contêiner, usada para fechar o dropdown ao clicar fora
  const dropdownRef = useRef(null);
  
  // Array de opções (de 1 a 10)
  const options = [...Array(10)].map((_, i) => i + 1);

  // Função para lidar com a seleção de uma nova quantidade
  const handleSelect = (newQuantity) => {
    onChange(newQuantity); // Chama a função de alteração do componente pai
    setIsOpen(false); // Fecha o dropdown
  };

  // Função para lidar com cliques fora do componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Se clicou fora do componente e o dropdown está aberto, feche-o
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Adiciona o listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Remove o listener na limpeza
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Depende do estado 'isOpen'

  return (
    <div 
      className="relative w-full" 
      ref={dropdownRef}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      role="combobox"
      aria-label="Quantidade do produto"
    >
      {/* O "Botão" que mostra o valor selecionado */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#e6e6e6] text-[#6B6B6B] text-lg py-2 px-4 rounded-2xl w-full text-center focus:outline-none focus:border-[#3DF034] focus:border-2 appearance-none cursor-pointer flex items-center justify-between"
      >
        {/* Aqui formatamos o texto como você deseja: "quantidade: [número]" */}
        <span className="flex-grow text-center">
          quantidade: {quantity}
        </span>
        
        {/* Ícone de Seta (para simular a seta do select) */}
        <svg 
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* A Lista de Opções (Dropdown) */}
      {isOpen && (
        <ul
          className="absolute z-10 w-full bg-white border border-[#3DF034] rounded-2xl mt-1 shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {options.map((num) => (
            <li
              key={num}
              onClick={() => handleSelect(num)}
              className={`text-center py-2 cursor-pointer hover:bg-gray-100 text-[#6B6B6B] text-lg transition duration-150 ease-in-out ${
                num === quantity ? 'bg-[#3DF034] text-white hover:bg-[#3DF034]' : ''
              }`}
              role="option"
              aria-selected={num === quantity}
            >
              {/* Nas opções, exibimos APENAS o número */}
              {num}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomQuantitySelect;