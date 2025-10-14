"use client";

import React, { useState } from "react";
import { AppUser } from "@/types/user";

// Componente simple para probar el modo conductor sin Firebase
const SimpleConductorPanel: React.FC<{
  conductor: AppUser;
  onLogout: () => void;
}> = ({ conductor, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {(conductor.fullName || conductor.displayName || "C")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  Modo Conductor
                </h1>
                <p className="text-white/60 text-sm">
                  {conductor.displayName || conductor.fullName}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
            >
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full">
          <h2 className="text-2xl font-bold text-white mb-4">
            ✅ Modo Conductor Funcionando
          </h2>
          <div className="space-y-4 text-white/80">
            <p>
              Si puedes ver este panel, el modo conductor está funcionando
              correctamente.
            </p>
            <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-200 mb-2">
                Información del Conductor:
              </h3>
              <ul className="space-y-1 text-emerald-100/80">
                <li>
                  <strong>Nombre:</strong>{" "}
                  {conductor.displayName || conductor.fullName}
                </li>
                <li>
                  <strong>Email:</strong> {conductor.email}
                </li>
                <li>
                  <strong>ID:</strong> {conductor.uid}
                </li>
              </ul>
            </div>
            <p className="text-sm text-white/60">
              Este es un panel simplificado para verificar que la funcionalidad
              básica está operativa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// LoginPanel simplificado
const SimpleLoginPanel: React.FC<{
  onAdminLogin: (user: any) => void;
  onConductorLogin: (conductor: AppUser) => void;
}> = ({ onAdminLogin, onConductorLogin }) => {
  const handleTestConductor = () => {
    const testConductor: AppUser = {
      uid: "test-conductor-1",
      email: "conductor@test.com",
      displayName: "Conductor de Prueba",
      fullName: "Conductor de Prueba",
      role: "conductor",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "system",
      linkedProviders: ["phone"],
      loginCount: 1,
    };
    onConductorLogin(testConductor);
  };

  const handleTestAdmin = () => {
    const testAdmin = {
      id: "test-admin-1",
      email: "admin@test.com",
      displayName: "Administrador de Prueba",
    };
    onAdminLogin(testAdmin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Sistema de Territorios
        </h1>
        <div className="space-y-4">
          <button
            onClick={handleTestAdmin}
            className="w-full p-4 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded-lg border border-green-400/30 transition-colors"
          >
            👑 Modo Administrador (Prueba)
          </button>
          <button
            onClick={handleTestConductor}
            className="w-full p-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg border border-blue-400/30 transition-colors"
          >
            🚗 Modo Conductor (Prueba)
          </button>
        </div>
      </div>
    </div>
  );
};

export type AppMode = "login" | "admin" | "conductor";

const SimpleRoleBasedApp: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>("login");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedConductor, setSelectedConductor] = useState<AppUser | null>(
    null
  );

  const handleAdminLogin = (user: any) => {
    setCurrentUser(user);
    setCurrentMode("admin");
  };

  const handleConductorLogin = (conductor: AppUser) => {
    setSelectedConductor(conductor);
    setCurrentMode("conductor");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedConductor(null);
    setCurrentMode("login");
  };

  if (currentMode === "login") {
    return (
      <SimpleLoginPanel
        onAdminLogin={handleAdminLogin}
        onConductorLogin={handleConductorLogin}
      />
    );
  }

  if (currentMode === "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold text-white mb-4">
            Modo Admin (Simplificado)
          </h2>
          <p className="text-white/80 mb-4">
            Panel de administrador funcionando.
          </p>
          <button
            onClick={handleLogout}
            className="w-full p-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (currentMode === "conductor" && selectedConductor) {
    return (
      <SimpleConductorPanel
        conductor={selectedConductor}
        onLogout={handleLogout}
      />
    );
  }

  return null;
};

export default SimpleRoleBasedApp;
