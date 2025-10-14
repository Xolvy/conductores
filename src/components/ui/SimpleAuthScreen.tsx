"use client";

import React, { useState } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface SimpleAuthScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

const SimpleAuthScreen: React.FC<SimpleAuthScreenProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format phone number from 0994749286 to +593994749286
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, "");

    // If starts with 09, convert to +5939
    if (cleaned.startsWith("09") && cleaned.length === 10) {
      return "+593" + cleaned.substring(1);
    }

    // If already starts with +593, keep it
    if (value.startsWith("+593")) {
      return value;
    }

    // If starts with 593, add +
    if (cleaned.startsWith("593") && cleaned.length === 12) {
      return "+" + cleaned;
    }

    return value;
  };

  // Detect if input is email or phone number
  const isEmail = (input: string): boolean => {
    return input.includes("@") && input.includes(".");
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permitir ingresar el número local tal como lo escribe el usuario
    setUsername(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Usuario y contraseña son requeridos");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let email = username;

      // If it's a phone number, convert to email format for Firebase
      if (!isEmail(username)) {
        // Permitir login con el número local, sin reformatear
        email = username.replace(/\D/g, "") + "@phone.local";
      }

      const result = await signInWithEmailAndPassword(auth, email, password);

      // Create user profile object
      const userProfile = {
        uid: result.user.uid,
        email: result.user.email,
        phoneNumber: !isEmail(username) ? formatPhoneNumber(username) : null,
        displayName: result.user.displayName || "Usuario",
        photoURL: result.user.photoURL,
      };

      onAuthSuccess(userProfile);
    } catch (error: any) {
      console.error("Error en login:", error);

      // Handle specific error messages
      let errorMessage = "Error de autenticación";

      if (error.code === "auth/user-not-found") {
        errorMessage = "Usuario no encontrado";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Contraseña incorrecta";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email o teléfono inválido";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Demasiados intentos. Intenta más tarde";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            ✕
          </button>

          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-white/70">Ingresa tu usuario y contraseña</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-300">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field (Email or Phone) */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Celular o correo electrónico"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Tu contraseña"
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Info */}
        </div>
      </div>
    </div>
  );
};

export default SimpleAuthScreen;
