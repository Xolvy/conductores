# 🔥 Guía de Configuración de Firebase

## 📋 Estado Actual

- ✅ **Aplicación funcionando en MODO OFFLINE**
- ✅ **Datos almacenados localmente (localStorage)**
- ✅ **Sin errores de conexión a Firebase**
- ⚠️ **Firebase deshabilitado (configuración offline-mode)**

## 🚀 Pasos para Habilitar Firebase (Opcional)

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto" o usa uno existente
3. Sigue el asistente de configuración

### 2. Configurar Autenticación

1. En el panel izquierdo, ve a **Authentication**
2. Haz clic en **Comenzar**
3. Ve a la pestaña **Sign-in method**
4. Habilita los métodos que necesites:
   - ✅ Email/Contraseña
   - ✅ Anónimo
   - ✅ Teléfono (opcional)

### 3. Configurar Firestore Database

1. En el panel izquierdo, ve a **Firestore Database**
2. Haz clic en **Crear base de datos**
3. Selecciona **Comenzar en modo de prueba**
4. Elige una ubicación (preferiblemente cercana a tus usuarios)

### 4. Obtener Credenciales

1. Ve a **Configuración del proyecto** ⚙️
2. Desplázate hasta **Tus aplicaciones**
3. Haz clic en **</>** (Web)
4. Registra tu aplicación con nombre `conductores-app`
5. **COPIA** las credenciales que aparecen

### 5. Actualizar .env.local

Reemplaza estas líneas en tu archivo `.env.local`:

```bash
# Reemplaza estos valores 'offline-*' con tus credenciales reales:
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_real
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-tu_measurement_id
```

### 6. Reiniciar Servidor

```bash
# Detener servidor actual (Ctrl+C)
# Luego ejecutar:
npm run dev
```

## 🎯 Beneficios de Habilitar Firebase

- 🔄 **Sincronización en tiempo real** entre usuarios
- 💾 **Respaldo automático** de datos
- 👥 **Colaboración multiusuario**
- 📱 **Acceso desde múltiples dispositivos**
- 🔒 **Autenticación segura**

## ⚡ Modo Actual (Offline)

- ✅ **Completamente funcional** sin Firebase
- ✅ **Datos persistentes** en localStorage
- ✅ **Sin dependencias externas**
- ✅ **Desarrollo rápido** sin configuración adicional

---

💡 **Nota**: La aplicación funciona perfectamente en modo offline. Solo habilita Firebase si necesitas las funciones colaborativas o de sincronización.
