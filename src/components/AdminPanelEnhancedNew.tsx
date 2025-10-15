"use client";

import React from "react";

// Componente temporalmente deshabilitado para evitar errores de tipos incompatibles
// PENDIENTE: Migrar este componente para usar UnifiedAppContext correctamente

export default function EnhancedAdminPanelNew({
  onLogout,
}: {
  readonly onLogout?: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-white mb-4">
            Panel de Administración Mejorado
          </h1>
          <div className="text-white/70 space-y-2">
            <p> Este panel está temporalmente deshabilitado</p>
            <p>
              Necesita ser migrado para ser compatible con el UnifiedAppContext
            </p>
            <p>Usa el panel de administración principal mientras tanto.</p>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
