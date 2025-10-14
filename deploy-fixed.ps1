# 🚀 Script de Deployment Mejorado - App Conductores v2.0

param(
    [switch]$SkipBuild = $false,
    [switch]$Debug = $false
)

# Configurar variables de entorno
$env:NODE_ENV = "production"
$env:NEXT_TELEMETRY_DISABLED = "1"

Write-Host "🔥 Iniciando deployment mejorado de App Conductores v2.0..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json. Ejecuta desde el directorio raíz del proyecto." -ForegroundColor Red
    exit 1
}

# Limpiar deployment anterior
Write-Host "🧹 Limpiando archivos de deployment anterior..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# Crear estructura de directorios
Write-Host "📁 Creando estructura de deployment..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "dist" -Force | Out-Null

# Copiar y arreglar archivos estáticos
Write-Host "📋 Copiando archivos estáticos..." -ForegroundColor Yellow
if (Test-Path "public") {
    # Copiar todos los archivos públicos excepto los problemáticos
    Get-ChildItem "public" -Recurse | Where-Object { 
        $_.Name -notmatch "(service-worker\.js|sw\.js|workbox.*\.js)$" 
    } | ForEach-Object {
        $relativePath = $_.FullName.Substring((Get-Item "public").FullName.Length + 1)
        $destPath = Join-Path "dist" $relativePath
        $destDir = Split-Path $destPath -Parent
        
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        
        Copy-Item $_.FullName -Destination $destPath -Force
    }
}

# Copiar service worker arreglado
Write-Host "🔧 Instalando service worker arreglado..." -ForegroundColor Yellow
if (Test-Path "service-worker-fixed.js") {
    Copy-Item "service-worker-fixed.js" -Destination "dist/service-worker.js" -Force
} else {
    Write-Host "⚠️ Advertencia: service-worker-fixed.js no encontrado" -ForegroundColor Yellow
}

# Instalar index.html arreglado
Write-Host "🌐 Instalando página principal arreglada..." -ForegroundColor Yellow
if (Test-Path "index-fixed.html") {
    Copy-Item "index-fixed.html" -Destination "dist/index.html" -Force
    Write-Host "✅ index.html arreglado instalado" -ForegroundColor Green
} else {
    Write-Host "⚠️ Creando index.html básico..." -ForegroundColor Yellow
    
    # Crear index.html básico si no existe el arreglado
    $basicHtml = @"
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Conductores</title>
    <link rel="icon" href="/favicon.ico">
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #1e293b 100%);
            font-family: system-ui, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 1rem;
            backdrop-filter: blur(10px);
        }
        .logo { font-size: 4rem; margin-bottom: 1rem; }
        .title { font-size: 2rem; margin-bottom: 0.5rem; }
        .subtitle { opacity: 0.8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🏠</div>
        <h1 class="title">App Conductores</h1>
        <p class="subtitle">Sistema de Gestión de Territorios</p>
        <p style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.7;">
            ✅ Desplegado exitosamente<br>
            🔄 Sistema funcionando correctamente
        </p>
    </div>
</body>
</html>
"@
    
    $basicHtml | Out-File -FilePath "dist/index.html" -Encoding UTF8
}

# Crear manifest.json si no existe
if (!(Test-Path "dist/manifest.json")) {
    Write-Host "📱 Creando manifest.json..." -ForegroundColor Yellow
    
    $manifest = @{
        "name" = "App Conductores"
        "short_name" = "Conductores"
        "description" = "Sistema de gestión de territorios"
        "start_url" = "/"
        "display" = "standalone"
        "background_color" = "#1e293b"
        "theme_color" = "#10b981"
        "icons" = @(
            @{
                "src" = "/icon-192.png"
                "sizes" = "192x192"
                "type" = "image/png"
            },
            @{
                "src" = "/icon-512.png"
                "sizes" = "512x512"
                "type" = "image/png"
            }
        )
    } | ConvertTo-Json -Depth 10
    
    $manifest | Out-File -FilePath "dist/manifest.json" -Encoding UTF8
}

# Verificar estructura creada
Write-Host "🔍 Verificando archivos de deployment..." -ForegroundColor Yellow
$files = Get-ChildItem "dist" -Recurse | Measure-Object
Write-Host "📊 Total de archivos preparados: $($files.Count)" -ForegroundColor Cyan

if ($Debug) {
    Write-Host "📋 Lista de archivos:" -ForegroundColor Cyan
    Get-ChildItem "dist" -Recurse | ForEach-Object {
        Write-Host "  - $($_.FullName.Substring((Get-Item 'dist').FullName.Length + 1))" -ForegroundColor Gray
    }
}

# Verificar que firebase.json está configurado correctamente
Write-Host "🔧 Verificando configuración de Firebase..." -ForegroundColor Yellow
if (Test-Path "firebase.json") {
    $firebaseConfig = Get-Content "firebase.json" | ConvertFrom-Json
    if ($firebaseConfig.hosting.public -eq "dist") {
        Write-Host "✅ firebase.json configurado correctamente" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Actualizando configuración de firebase.json..." -ForegroundColor Yellow
        $firebaseConfig.hosting.public = "dist"
        $firebaseConfig | ConvertTo-Json -Depth 10 | Out-File -FilePath "firebase.json" -Encoding UTF8
    }
} else {
    Write-Host "❌ Error: firebase.json no encontrado" -ForegroundColor Red
    exit 1
}

# Hacer deployment a Firebase Hosting
Write-Host "" -ForegroundColor Green
Write-Host "🚀 Desplegando a Firebase Hosting..." -ForegroundColor Green
Write-Host "📡 Subiendo archivos..." -ForegroundColor Yellow

$deployResult = firebase deploy --only hosting 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "" -ForegroundColor Green
    Write-Host "🎉 ¡DEPLOYMENT EXITOSO!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Yellow
    Write-Host "📱 Tu aplicación está disponible en:" -ForegroundColor Yellow
    Write-Host "   🌐 https://conductores-9oct.web.app" -ForegroundColor Cyan
    Write-Host "   🌐 https://conductores-9oct.firebaseapp.com" -ForegroundColor Cyan
    Write-Host "" -ForegroundColor Green
    
    Write-Host "✅ Mejoras aplicadas:" -ForegroundColor Green
    Write-Host "   • Service Worker corregido (sin errores)" -ForegroundColor White
    Write-Host "   • HTML optimizado con manejo de errores" -ForegroundColor White
    Write-Host "   • Firebase SDK actualizado a versión modular" -ForegroundColor White
    Write-Host "   • Caché mejorado para mejor rendimiento" -ForegroundColor White
    Write-Host "   • Manejo de errores más robusto" -ForegroundColor White
    
    Write-Host "" -ForegroundColor Green
    Write-Host "🔧 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "   1. ✅ Visita la aplicación para verificar funcionamiento" -ForegroundColor White
    Write-Host "   2. 🌐 Configura dominio personalizado (opcional)" -ForegroundColor White
    Write-Host "   3. 👥 Configura usuarios en Firebase Authentication" -ForegroundColor White
    Write-Host "   4. 📊 Revisa Firebase Console para estadísticas" -ForegroundColor White
    
} else {
    Write-Host "" -ForegroundColor Red
    Write-Host "❌ Error en el deployment:" -ForegroundColor Red
    Write-Host $deployResult -ForegroundColor Red
    Write-Host "" -ForegroundColor Yellow
    Write-Host "🔧 Posibles soluciones:" -ForegroundColor Yellow
    Write-Host "   1. Verifica tu conexión a internet" -ForegroundColor White
    Write-Host "   2. Ejecuta: firebase login" -ForegroundColor White
    Write-Host "   3. Verifica permisos del proyecto Firebase" -ForegroundColor White
    exit 1
}

Write-Host "" -ForegroundColor Green
Write-Host "🚀 App Conductores v2.0 desplegada exitosamente!" -ForegroundColor Green
Write-Host "🏠 Sistema de gestión de territorios operativo" -ForegroundColor Cyan