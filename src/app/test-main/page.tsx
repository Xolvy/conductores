"use client";

import React, { useState } from "react";

export default function TestMainPage() {
  const [currentMode, setCurrentMode] = useState<
    "login" | "admin" | "conductor"
  >("login");

  const handleModeChange = (mode: "login" | "admin" | "conductor") => {
    setCurrentMode(mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            🧪 Test de Modos de Aplicación
          </h1>

          <div className="space-y-4">
            <div className="text-center text-white/80 mb-4">
              Modo actual:{" "}
              <span className="font-bold text-blue-300">{currentMode}</span>
            </div>

            <div className="grid gap-2">
              <button
                onClick={() => handleModeChange("login")}
                className={`p-3 rounded-lg border transition-colors ${
                  currentMode === "login"
                    ? "bg-blue-500 text-white border-blue-400"
                    : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
                }`}
              >
                🔐 Modo Login
              </button>

              <button
                onClick={() => handleModeChange("admin")}
                className={`p-3 rounded-lg border transition-colors ${
                  currentMode === "admin"
                    ? "bg-green-500 text-white border-green-400"
                    : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
                }`}
              >
                👑 Modo Admin
              </button>

              <button
                onClick={() => handleModeChange("conductor")}
                className={`p-3 rounded-lg border transition-colors ${
                  currentMode === "conductor"
                    ? "bg-purple-500 text-white border-purple-400"
                    : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
                }`}
              >
                🚗 Modo Conductor
              </button>
            </div>

            {currentMode === "conductor" && (
              <div className="mt-6 p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
                <h2 className="text-purple-200 font-semibold mb-2">
                  Vista Conductor Simplificada
                </h2>
                <p className="text-purple-100/80 text-sm">
                  Si ves esto, el modo conductor básico funciona correctamente.
                </p>
              </div>
            )}

            {currentMode === "admin" && (
              <div className="mt-6 p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                <h2 className="text-green-200 font-semibold mb-2">
                  Vista Admin Simplificada
                </h2>
                <p className="text-green-100/80 text-sm">
                  Panel de administración funcionando.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
