# Script de Despliegue Optimizado - Sistema de Territorios
# Versión: 2.0.0

Write-Host "🚀 Iniciando despliegue del Sistema de Territorios..." -ForegroundColor Green

# Verificar prerrequisitos
Write-Host "🔍 Verificando prerrequisitos..." -ForegroundColor Yellow

# Verificar Firebase CLI
if (!(Get-Command firebase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Firebase CLI no encontrado. Instalar con: npm install -g firebase-tools" -ForegroundColor Red
    exit 1
}

# Verificar archivos fuente
if (!(Test-Path "src\index.html")) {
    Write-Host "❌ Archivo fuente src\index.html no encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prerrequisitos verificados" -ForegroundColor Green

# Preparar directorio dist/
Write-Host "📦 Preparando archivos para despliegue..." -ForegroundColor Yellow

# Limpiar dist/ si existe
if (Test-Path "dist") {
    Remove-Item "dist\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "🧹 Limpiando directorio dist/" -ForegroundColor Gray
}

# Copiar archivos fuente a dist/
Copy-Item "src\*" "dist\" -Recurse -Force
Write-Host "📋 Archivos copiados desde src/ a dist/" -ForegroundColor Gray

# Verificar que los archivos críticos existan
$criticalFiles = @("dist\index.html", "dist\manifest.json")
foreach ($file in $criticalFiles) {
    if (!(Test-Path $file)) {
        Write-Host "❌ Archivo crítico no encontrado: $file" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Archivos preparados correctamente" -ForegroundColor Green

# Verificar proyecto Firebase
Write-Host "🔧 Verificando configuración Firebase..." -ForegroundColor Yellow

$project = firebase use --json | ConvertFrom-Json
if ($project.result -ne "conductores-9oct") {
    Write-Host "⚠️ Proyecto Firebase incorrecto. Configurando..." -ForegroundColor Yellow
    firebase use conductores-9oct
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error configurando proyecto Firebase" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Proyecto Firebase: conductores-9oct" -ForegroundColor Green

# Desplegar aplicación
Write-Host "🚀 Desplegando aplicación..." -ForegroundColor Yellow
Write-Host "⏳ Este proceso puede tardar unos minutos..." -ForegroundColor Gray

firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host "" 
    Write-Host "🎉 ¡Despliegue exitoso!" -ForegroundColor Green
    Write-Host "🌐 URL Producción: https://conductores-9oct.web.app" -ForegroundColor Cyan
    Write-Host "🏗️ Firebase Console: https://console.firebase.google.com/project/conductores-9oct" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Checklist de Verificación:" -ForegroundColor Yellow
    Write-Host "  □ Abrir URL de producción" -ForegroundColor Gray
    Write-Host "  □ Probar login Admin (admin123)" -ForegroundColor Gray
    Write-Host "  □ Probar login SuperAdmin (0994749286 + Sonita.09)" -ForegroundColor Gray
    Write-Host "  □ Verificar PWA instalable" -ForegroundColor Gray
    Write-Host "  □ Probar funcionalidad offline" -ForegroundColor Gray
    Write-Host ""
    
    # Intentar abrir navegador
    try {
        Start-Process "https://conductores-9oct.web.app"
        Write-Host "🔗 Abriendo aplicación en el navegador..." -ForegroundColor Green
    } catch {
        Write-Host "💡 Abrir manualmente: https://conductores-9oct.web.app" -ForegroundColor Blue
    }
    
} else {
    Write-Host "❌ Error en el despliegue" -ForegroundColor Red
    Write-Host "💡 Verificar:" -ForegroundColor Yellow
    Write-Host "  - Conexión a internet" -ForegroundColor Gray
    Write-Host "  - Permisos en Firebase project" -ForegroundColor Gray
    Write-Host "  - Autenticación Firebase CLI: firebase login" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "✨ Script completado - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Green