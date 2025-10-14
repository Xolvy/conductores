"use client";

import React, { useState, Suspense, lazy } from "react";
import { useUnifiedApp } from "@/context/UnifiedAppContext";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import UserManagementPanel from "@/components/modules/UserManagementPanel";
import {
  Shield,
  Users,
  Map,
  Database,
  CheckCircle,
  AlertCircle,
  Brain,
} from "lucide-react";

// Lazy loading del dashboard de IA
const ArtificialIntelligenceDashboard = lazy(
  () => import("@/components/admin/ArtificialIntelligenceDashboard")
);

export default function AdminPanel() {
  const { state } = useUnifiedApp();

  // Extraer los datos del estado
  const conductores = Object.values(state.conductores || {});
  const territorios = Object.values(state.territories || {});
  const tarjetas = Object.values(state.phoneNumbers || {});
  const isLoading = state.isLoading;
  const isFirebaseConnected = state.isAuthenticated; // Usar el estado de autenticación como proxy

  // Estado para demo de funcionalidades
  const [activeSection, setActiveSection] = useState<string>("overview");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Cargando panel de administración..." />
      </div>
    );
  }

  const stats = {
    totalConductores: conductores?.length || 0,
    totalTerritorios: territorios?.length || 0,
    totalTarjetas: tarjetas?.length || 0,
    conexionFirebase: isFirebaseConnected,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Panel de Administración
            </h1>
            <p className="text-gray-600">Gestión del sistema de territorios</p>
          </div>
        </div>

        {/* Estado de conexión */}
        <div className="flex items-center gap-2 mt-4">
          {isFirebaseConnected ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-600 font-medium">
                Conectado a Firebase
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-600 font-medium">Desconectado</span>
            </>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {stats.totalConductores}
          </p>
          <p className="text-gray-600">Conductores</p>
        </div>

        <div className="glass-card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Map className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {stats.totalTerritorios}
          </p>
          <p className="text-gray-600">Territorios</p>
        </div>

        <div className="glass-card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Database className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {stats.totalTarjetas}
          </p>
          <p className="text-gray-600">Tarjetas</p>
        </div>

        <div className="glass-card text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <p
            className={`text-2xl font-bold ${
              isFirebaseConnected ? "text-green-600" : "text-red-600"
            }`}
          >
            {isFirebaseConnected ? "OK" : "OFF"}
          </p>
          <p className="text-gray-600">Estado</p>
        </div>
      </div>

      {/* Navegación de secciones */}
      <div className="glass-card">
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: "overview", label: "Resumen", icon: Database },
            { id: "users", label: "Usuarios", icon: Users },
            { id: "conductores", label: "Conductores", icon: Users },
            { id: "territorios", label: "Territorios", icon: Map },
            { id: "ai", label: "Inteligencia Artificial", icon: Brain },
          ].map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contenido de secciones */}
        {activeSection === "users" && <UserManagementPanel />}

        {activeSection === "ai" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Sistema de Inteligencia Artificial
                </h3>
                <p className="text-gray-600 text-sm">
                  Predicciones, optimización de rutas y recomendaciones
                  personalizadas
                </p>
              </div>
            </div>

            <ErrorBoundary>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-96">
                    <LoadingSpinner
                      size="lg"
                      text="Cargando sistema de IA..."
                    />
                  </div>
                }
              >
                <ArtificialIntelligenceDashboard />
              </Suspense>
            </ErrorBoundary>
          </div>
        )}

        {activeSection === "overview" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Resumen del Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  Estado de Conexión
                </h4>
                <p className="text-blue-700 text-sm">
                  Firebase:{" "}
                  {isFirebaseConnected
                    ? "Conectado correctamente"
                    : "Sin conexión"}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">
                  Datos Cargados
                </h4>
                <p className="text-green-700 text-sm">
                  {stats.totalConductores +
                    stats.totalTerritorios +
                    stats.totalTarjetas}{" "}
                  registros totales
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "conductores" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Gestión de Conductores
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {conductores?.length > 0 ? (
                conductores.map((conductor, index) => (
                  <div
                    key={conductor.id || index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {conductor.nombre}
                      </p>
                      <p className="text-sm text-gray-600">
                        ID: {conductor.id || "N/A"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          console.log(`Editando ${conductor.nombre}`)
                        }
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay conductores registrados
                </p>
              )}
            </div>
          </div>
        )}

        {activeSection === "territorios" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Gestión de Territorios
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {territorios?.length > 0 ? (
                territorios.map((territorio, index) => (
                  <div
                    key={territorio.id || index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        Territorio {territorio.numero || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Manzanas: {territorio.totalManzanas || 0}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          console.log(
                            `Gestionando territorio ${territorio.numero}`
                          )
                        }
                      >
                        Gestionar
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay territorios registrados
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Acciones rápidas */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={() =>
              console.log("Función de agregar conductor en desarrollo")
            }
            className="bg-blue-500 hover:bg-blue-600"
          >
            Agregar Conductor
          </Button>
          <Button
            onClick={() =>
              console.log("Función de crear territorio en desarrollo")
            }
            className="bg-green-500 hover:bg-green-600"
          >
            Crear Territorio
          </Button>
          <Button
            onClick={() => console.log("Generando reporte...")}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Generar Reporte
          </Button>
          <Button
            onClick={() => {
              setActiveSection("ai");
              console.log("Accediendo al sistema de IA...");
            }}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
          >
            <Brain className="w-4 h-4 mr-2" />
            Panel de IA
          </Button>
        </div>
      </div>
    </div>
  );
}
