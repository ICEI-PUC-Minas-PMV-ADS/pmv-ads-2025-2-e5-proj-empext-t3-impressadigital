import React, { useState, useRef, useEffect } from 'react';

// Definindo a interface (ou type) para as props
interface CustomQuantitySelectProps {
  quantity: number;
  onChange: (newQuantity: number) => void;
}

/**
 * Componente Dropdown customizado para seleção de quantidade.
 */
const CustomQuantitySelect: React.FC<CustomQuantitySelectProps> = ({ quantity, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const options = [...Array(10)].map((_, i) => i + 1);

  const handleSelect = (newQuantity: number) => {
    onChange(newQuantity);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div
      className="relative w-full"
      ref={dropdownRef}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      role="combobox"
      aria-label="Quantidade do produto"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#e6e6e6] text-[#6B6B6B] text-lg py-2 px-4 rounded-2xl w-full text-center focus:outline-none focus:border-[#3DF034] focus:border-2 appearance-none cursor-pointer flex items-center justify-between"
      >
        <span className="flex-grow text-center">quantidade: {quantity}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

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
              {num}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomQuantitySelect;
