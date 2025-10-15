"use client";

import React from "react";
import Link from "next/link";

interface ReadonlyHomePageProps {}

export default function HomePage({}: ReadonlyHomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  App Conductores
                </h1>
                <p className="text-sm text-gray-500">
                  Sistema de Gestión Territorial
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/diagnostico"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Diagnóstico
              </Link>
              <Link
                href="/admin"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Panel Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Gestión Inteligente de
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              Territorios
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema completo para la organización y seguimiento de territorios
            de predicación, optimizado para congregaciones modernas con
            herramientas offline-first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🚀 Comenzar Ahora
            </Link>
            <Link
              href="/enhanced"
              className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-all border border-gray-200 shadow-md"
            >
              📊 Ver Demo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Feature 1: Territory Management */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Gestión de Territorios
            </h3>
            <p className="text-gray-600 mb-4">
              Asignación inteligente y seguimiento en tiempo real del progreso
              de cada territorio.
            </p>
            <Link
              href="/admin"
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Explorar →
            </Link>
          </div>

          {/* Feature 2: Phone Preaching */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Predicación Telefónica
            </h3>
            <p className="text-gray-600 mb-4">
              Sistema completo de gestión de números telefónicos y seguimiento
              de llamadas.
            </p>
            <Link
              href="/test-conductor"
              className="text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              Ver más →
            </Link>
          </div>

          {/* Feature 3: Offline Mode */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Modo Offline
            </h3>
            <p className="text-gray-600 mb-4">
              Funciona completamente sin conexión, con sincronización opcional
              cuando esté disponible.
            </p>
            <Link
              href="/diagnostico"
              className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
            >
              Diagnosticar →
            </Link>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 Acceso Rápido
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin"
              className="bg-blue-50 hover:bg-blue-100 p-6 rounded-xl transition-colors group"
            >
              <div className="text-2xl mb-2">👥</div>
              <div className="font-medium text-gray-900 group-hover:text-blue-700">
                Panel Administrativo
              </div>
              <div className="text-sm text-gray-500">
                Gestión completa del sistema
              </div>
            </Link>

            <Link
              href="/enhanced"
              className="bg-green-50 hover:bg-green-100 p-6 rounded-xl transition-colors group"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium text-gray-900 group-hover:text-green-700">
                Vista Mejorada
              </div>
              <div className="text-sm text-gray-500">Dashboard avanzado</div>
            </Link>

            <Link
              href="/test-conductor"
              className="bg-orange-50 hover:bg-orange-100 p-6 rounded-xl transition-colors group"
            >
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium text-gray-900 group-hover:text-orange-700">
                Panel Conductor
              </div>
              <div className="text-sm text-gray-500">Vista de conductor</div>
            </Link>

            <Link
              href="/diagnostico"
              className="bg-purple-50 hover:bg-purple-100 p-6 rounded-xl transition-colors group"
            >
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-medium text-gray-900 group-hover:text-purple-700">
                Diagnóstico
              </div>
              <div className="text-sm text-gray-500">Estado del sistema</div>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Offline Ready</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">16</div>
              <div className="text-gray-600">Páginas Activas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                272KB
              </div>
              <div className="text-gray-600">Bundle Optimizado</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">PWA</div>
              <div className="text-gray-600">App Instalable</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 mb-4 md:mb-0">
              © 2025 App Conductores - Sistema de Gestión Territorial
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Administración
              </Link>
              <Link
                href="/diagnostico"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Diagnóstico
              </Link>
              <Link
                href="/enhanced"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Vista Avanzada
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
