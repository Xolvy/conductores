"use client";

import React from "react";

export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-white mb-4">
          ✅ Aplicación funcionando correctamente
        </h1>
        <p className="text-white/80 mb-4">
          Si puedes ver esta página, la aplicación está cargando sin errores de
          cliente.
        </p>
        <div className="space-y-2 text-sm text-white/60">
          <div>📅 Fecha: {new Date().toLocaleDateString()}</div>
          <div>⏰ Hora: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
}
