# Script de Limpieza Completa - Eliminación Masiva de Archivos Obsoletos
# Sistema de Territorios - Optimización Final

Write-Host "🧹 LIMPIEZA MASIVA DE ARCHIVOS OBSOLETOS" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Gray

function Remove-ObsoleteFile {
    param([string]$FilePath, [string]$Description)
    
    if (Test-Path $FilePath) {
        try {
            Remove-Item $FilePath -Force
            Write-Host "✅ $Description" -ForegroundColor Green
            return $true
        }
        catch {
            Write-Host "❌ Error: $FilePath" -ForegroundColor Red
            return $false
        }
    }
    else {
        return $false
    }
}

$TotalFiles = 0
$DeletedFiles = 0

Write-Host "`n🗂️ ELIMINANDO VERSIONES OBSOLETAS DE INDEX..." -ForegroundColor Magenta

# Versiones obsoletas de index - mantener solo index-firebase-v9.html que se moverá a src/
$IndexFiles = @(
    "index-complete-v2.html",
    "index-complete.html", 
    "index-final.html",
    "index-fixed.html",
    "index-production.html",
    "index-react.html",
    "index-v3.html"
)

foreach ($file in $IndexFiles) {
    $TotalFiles++
    if (Remove-ObsoleteFile $file "Eliminado index obsoleto: $file") { $DeletedFiles++ }
}

Write-Host "`n📄 ELIMINANDO DOCUMENTOS OBSOLETOS..." -ForegroundColor Magenta

# Documentos markdown obsoletos
$DocFiles = @(
    "ADMIN_SUPERADMIN_RESTAURADO.md",
    "CACHE_LIMPIADO.md", 
    "CLEANUP_ANALYSIS.md",
    "DEPLOYMENT-FINAL-EXITOSO.md",
    "DEPLOYMENT-SUCCESS.md",
    "ERRORES-CORREGIDOS.md",
    "EXTENSIONES_FUTURISTAS_2026.md",
    "FUNCIONALIDADES_RESTAURADAS.md",
    "ROLES-RESTAURADOS.md",
    "SISTEMA-V3-COMPLETO.md",
    "README.md"  # El del root, mantenemos el de docs/
)

foreach ($file in $DocFiles) {
    $TotalFiles++
    if (Remove-ObsoleteFile $file "Eliminado documento: $file") { $DeletedFiles++ }
}

Write-Host "`n⚙️ ELIMINANDO SCRIPTS Y CONFIGS OBSOLETOS..." -ForegroundColor Magenta

# Scripts y configuraciones duplicadas
$ConfigFiles = @(
    "deploy-final.ps1",
    "deploy-fixed.ps1", 
    "deploy.ps1",
    "deployment-scripts.json",
    "generate-icons.ps1",  # Movido a scripts/
    "healthcheck.js",
    "init-test-data.js",
    "useAdvancedAnalytics.js",
    "package-2026.json",
    "package.json",  # Mantenemos package-optimized.json
    "tsconfig-optimized.json",
    ".eslintrc-optimized.js",
    ".prettierrc-optimized.js"
)

foreach ($file in $ConfigFiles) {
    $TotalFiles++
    if (Remove-ObsoleteFile $file "Eliminado config: $file") { $DeletedFiles++ }
}

Write-Host "`n🐳 ELIMINANDO ARCHIVOS DOCKER/K8S OBSOLETOS..." -ForegroundColor Magenta

# Archivos Docker y Kubernetes no necesarios para este proyecto
$DockerFiles = @(
    "docker-compose.yml",
    "Dockerfile",
    "Dockerfile.2026", 
    "k8s-deployment.yaml",
    "k8s-secrets.yaml",
    "nginx.conf"
)

foreach ($file in $DockerFiles) {
    $TotalFiles++
    if (Remove-ObsoleteFile $file "Eliminado Docker/K8s: $file") { $DeletedFiles++ }
}

Write-Host "`n📱 ELIMINANDO SERVICE WORKERS Y MANIFESTS OBSOLETOS..." -ForegroundColor Magenta

# Service Workers y manifests duplicados
$PWAFiles = @(
    "service-worker-fixed.js",
    "service-worker-production.js",
    "manifest-production.json", 
    "manifest-v3.json"
)

foreach ($file in $PWAFiles) {
    $TotalFiles++
    if (Remove-ObsoleteFile $file "Eliminado PWA: $file") { $DeletedFiles++ }
}

Write-Host "`n🌐 ELIMINANDO CONFIGS DE HOSTING OBSOLETOS..." -ForegroundColor Magenta

# Configuraciones de hosting obsoletas
$HostingFiles = @(
    "vercel.json",  # Ya no usamos Vercel
    ".env.example",
    ".env.local",
    ".env.local.example", 
    ".env.production"
)

foreach ($file in $HostingFiles) {
    $TotalFiles++
    if (Remove-ObsoleteFile $file "Eliminado hosting: $file") { $DeletedFiles++ }
}

# Mostrar resumen final
Write-Host "`n📊 RESUMEN FINAL:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Gray
Write-Host "📁 Total archivos procesados: $TotalFiles" -ForegroundColor White
Write-Host "✅ Archivos eliminados: $DeletedFiles" -ForegroundColor Green
Write-Host "❌ Errores: $($TotalFiles - $DeletedFiles)" -ForegroundColor Red
Write-Host "📈 Tasa de éxito: $([math]::Round(($DeletedFiles/$TotalFiles)*100, 1))%" -ForegroundColor Yellow

if ($DeletedFiles -gt 0) {
    Write-Host "`n🎉 ¡LIMPIEZA MASIVA COMPLETADA!" -ForegroundColor Green
    Write-Host "   ✨ Se eliminaron $DeletedFiles archivos obsoletos" -ForegroundColor Green
    Write-Host "   📦 Proyecto completamente optimizado" -ForegroundColor Green
}

Write-Host "`n📂 ESTRUCTURA FINAL OPTIMIZADA:" -ForegroundColor Cyan
Write-Host "├── src/ (aplicación principal)" -ForegroundColor Green
Write-Host "├── docs/ (documentación consolidada)" -ForegroundColor Green  
Write-Host "├── scripts/ (automatización)" -ForegroundColor Green
Write-Host "├── public/ (assets)" -ForegroundColor Green
Write-Host "├── firebase.json" -ForegroundColor Green
Write-Host "├── firestore.rules" -ForegroundColor Green
Write-Host "└── package-optimized.json" -ForegroundColor Green

Write-Host "`n🚀 SIGUIENTE PASO CRÍTICO:" -ForegroundColor Yellow
Write-Host "1. Mover index-firebase-v9.html a src/index.html" -ForegroundColor Cyan
Write-Host "2. Ejecutar: npm run build" -ForegroundColor Cyan
Write-Host "3. Ejecutar: npm run deploy" -ForegroundColor Cyan
Write-Host "4. Verificar: https://conductores-9oct.web.app" -ForegroundColor Cyan

Write-Host "`n✨ ¡PROYECTO TOTALMENTE MODERNIZADO Y OPTIMIZADO!" -ForegroundColor Green