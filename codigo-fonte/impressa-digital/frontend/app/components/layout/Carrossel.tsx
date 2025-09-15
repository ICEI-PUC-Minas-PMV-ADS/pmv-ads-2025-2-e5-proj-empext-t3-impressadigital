"use client";

import { useState, useEffect } from "react";



export default function Carrossel() {
  const slides = [
  "/images/frame1.png",
  
];

  const [current, setCurrent] = useState(0);

  // Navegação
  const prevSlide = () =>
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  const nextSlide = () =>
    setCurrent(current === slides.length - 1 ? 0 : current + 1);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // 10 segundos
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg group">
      {/* Slides */}
      {slides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Slide ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}

      {/* Botões de navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 px-4 py-4 bg-white/30 text-black rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-xl"
      >
        &#8592;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-4 bg-white/30 text-black rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-xl"
      >
        &#8594;
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === current ? "bg-white" : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
