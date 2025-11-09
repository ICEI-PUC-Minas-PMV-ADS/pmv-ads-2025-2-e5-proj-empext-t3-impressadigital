"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginModalContent() {
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("showModal") === "true") {
      setShowModal(true);
    }
  }, [searchParams]);

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Olá!</h2>
        <p className="mb-4">Para acessar seu perfil você deve estar logado</p>
        <button
          onClick={() => setShowModal(false)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition cursor-pointer"
        >
          Fazer Login
        </button>
      </div>
    </div>
  );
}

export default function LoginModal() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginModalContent />
        </Suspense>
    )
}
