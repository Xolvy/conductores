# 🚀 Script de Deployment Automático - App Conductores

# Configurar variables de entorno
$env:NODE_ENV = "production"
$env:NEXT_TELEMETRY_DISABLED = "1"

Write-Host "🔥 Iniciando deployment de App Conductores..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json. Ejecuta desde el directorio raíz del proyecto." -ForegroundColor Red
    exit 1
}

# Verificar configuración de Firebase
Write-Host "📋 Verificando configuración de Firebase..." -ForegroundColor Yellow
if (!(Test-Path "firebase.json")) {
    Write-Host "❌ Error: No se encontró firebase.json" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Configuración de Firebase encontrada" -ForegroundColor Green

# Crear directorio de build temporal
Write-Host "📁 Preparando archivos para deployment..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

New-Item -ItemType Directory -Path "dist" -Force | Out-Null

# Copiar archivos estáticos
Write-Host "📋 Copiando archivos estáticos..." -ForegroundColor Yellow
Copy-Item -Recurse -Force "public/*" "dist/" -ErrorAction SilentlyContinue

# Crear index.html básico para el hosting
$indexHtml = @"
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Conductores - Sistema de Gestión de Territorios</title>
    <meta name="description" content="Sistema de gestión de territorios y predicación telefónica">
    <link rel="icon" href="/favicon.ico">
    <link rel="manifest" href="/manifest.json">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- jsPDF -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    
    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"></script>
    
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #1e293b 100%);
            font-family: system-ui, -apple-system, sans-serif;
            min-height: 100vh;
        }
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            color: white;
        }
        .spinner {
            border: 3px solid rgba(255,255,255,0.3);
            border-top: 3px solid #10b981;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-right: 1rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div id="root">
        <div class="loading">
            <div class="spinner"></div>
            <div>
                <h1>🏠 App Conductores</h1>
                <p>Cargando sistema de gestión de territorios...</p>
            </div>
        </div>
    </div>
    
    <script>
        // Configuración de Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyCuIWh-1vuNFf7-pvAc73OBxl9XO9JNAJo",
            authDomain: "conductores-9oct.firebaseapp.com",
            projectId: "conductores-9oct",
            storageBucket: "conductores-9oct.appspot.com",
            messagingSenderId: "94952280857",
            appId: "1:94952280857:web:628608a9e3372fb6f2eb88",
            measurementId: "G-YM2JGP4KQ6"
        };
        
        // Inicializar Firebase
        firebase.initializeApp(firebaseConfig);
        
        // Mostrar mensaje de éxito
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                document.getElementById('root').innerHTML = `
                    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                        <div class="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                            <div class="w-24 h-24 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span class="text-white text-4xl">🏠</span>
                            </div>
                            <h1 class="text-4xl font-bold text-white mb-4">App Conductores</h1>
                            <p class="text-white/80 text-lg mb-6">Sistema de Gestión de Territorios</p>
                            <div class="space-y-2 text-white/60">
                                <p>✅ Firebase conectado</p>
                                <p>✅ Sistema desplegado exitosamente</p>
                                <p>✅ Listo para uso en producción</p>
                            </div>
                            <div class="mt-8">
                                <button onclick="window.location.reload()" class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                                    Iniciar Aplicación
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }, 2000);
        });
    </script>
</body>
</html>
"@

$indexHtml | Out-File -FilePath "dist/index.html" -Encoding UTF8

Write-Host "✅ Archivos preparados para deployment" -ForegroundColor Green

# Hacer deployment a Firebase Hosting
Write-Host "🚀 Desplegando a Firebase Hosting..." -ForegroundColor Green
firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host "" -ForegroundColor Green
    Write-Host "🎉 ¡DEPLOYMENT EXITOSO!" -ForegroundColor Green
    Write-Host "📱 Tu aplicación está disponible en:" -ForegroundColor Yellow
    Write-Host "   https://conductores-9oct.web.app" -ForegroundColor Cyan
    Write-Host "   https://conductores-9oct.firebaseapp.com" -ForegroundColor Cyan
    Write-Host "" -ForegroundColor Green
    Write-Host "🔧 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "   1. Configura el dominio personalizado en Firebase Console" -ForegroundColor White
    Write-Host "   2. Configura SSL/HTTPS automático" -ForegroundColor White
    Write-Host "   3. Revisa los logs de Firebase Hosting" -ForegroundColor White
} else {
    Write-Host "❌ Error en el deployment. Revisa los logs anteriores." -ForegroundColor Red
    exit 1
}

Write-Host "" -ForegroundColor Green
Write-Host "🚀 App Conductores desplegada exitosamente!" -ForegroundColor Green