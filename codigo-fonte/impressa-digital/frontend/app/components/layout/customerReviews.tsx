"use client";

import React from "react";

export default function CustomerReviews() {
  const reviews = Array(3).fill({
    user: "@usuario",
    text: "Comprei o kit e fiquei encantada! O painel veio com ótima qualidade, cores vivas e personalização deixou a festa ainda mais especial.",
    stars: 4,
  });

  return (
    <section className="p-6 ">
      
      {reviews.map((r, i) => (
        <div key={i} className="border rounded-lg p-4 mb-4 bg-white shadow">
          <p className="font-semibold">{r.user}</p>
          <p className="text-[#45A62D] text-xl">
            {"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}
          </p>
          <p className="text-gray-700 mt-2">{r.text}</p>
        </div>
      ))}
      <button className="text-gray-600 hover:underline text-center">Ver mais</button>
    </section>
  );
}
