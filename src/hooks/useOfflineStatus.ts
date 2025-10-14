/**
 * Hook para manejar el estado offline/online de la aplicación
 * Integra con Firestore para trabajo offline perfecto
 */

import { useState, useEffect } from "react";
import { offlineManager } from "@/lib/offlineManager";

interface ConnectionState {
  isOnline: boolean;
  isFirestoreConnected: boolean;
  lastSyncTime: Date | null;
  pendingChanges: number;
}

export const useOfflineStatus = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isOnline: navigator.onLine,
    isFirestoreConnected: false,
    lastSyncTime: null,
    pendingChanges: 0,
  });

  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // Listener para cambios de conexión
    const unsubscribe = offlineManager.onConnectionChange((online) => {
      setConnectionState((prev) => ({
        ...prev,
        isOnline: online,
        isFirestoreConnected: online,
        lastSyncTime: online ? new Date() : prev.lastSyncTime,
      }));

      // Mostrar banner offline solo cuando se pierde la conexión
      if (!online) {
        setShowOfflineBanner(true);
      } else {
        // Ocultar banner después de reconectar
        setTimeout(() => setShowOfflineBanner(false), 3000);
      }
    });

    // Verificar estado inicial
    setConnectionState((prev) => ({
      ...prev,
      isOnline: offlineManager.getConnectionStatus(),
    }));

    return unsubscribe;
  }, []);

  const refreshConnection = async () => {
    // Forzar reconexión
    window.location.reload();
  };

  const getStatusMessage = (): string => {
    if (connectionState.isOnline) {
      return "Conectado - Datos sincronizados";
    } else {
      return "Sin conexión - Trabajando offline";
    }
  };

  const getStatusColor = (): string => {
    return connectionState.isOnline ? "text-green-500" : "text-amber-500";
  };

  return {
    ...connectionState,
    showOfflineBanner,
    refreshConnection,
    getStatusMessage,
    getStatusColor,
    dismissBanner: () => setShowOfflineBanner(false),
  };
};
