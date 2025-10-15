# 🚀 Azure Static Web Apps Deployment Script - Production Optimized
# Optimizado para App Conductores

Write-Host "🌟 Iniciando deployment optimizado para Azure SWA..." -ForegroundColor Cyan

# 1. 🧹 Limpiar builds anteriores
Write-Host "`n🧹 Limpiando builds anteriores..." -ForegroundColor Yellow
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }

# 2. 📦 Instalar dependencias con cache optimizado
Write-Host "`n📦 Instalando dependencias con cache..." -ForegroundColor Yellow
npm ci --prefer-offline --no-audit --progress=false

# 3. 🏗️ Build optimizado para producción
Write-Host "`n🏗️ Construyendo aplicación para Azure SWA..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
$env:NEXT_TELEMETRY_DISABLED = "1"
npm run build

# 4. ✅ Verificar build exitoso
Write-Host "`n✅ Verificando build..." -ForegroundColor Yellow
if (Test-Path "out/index.html") {
    Write-Host "✅ Homepage generada correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error: Homepage no generada" -ForegroundColor Red
    exit 1
}

# 5. 📊 Estadísticas del build
Write-Host "`n📊 Estadísticas del build:" -ForegroundColor Cyan
$fileCount = (Get-ChildItem -Recurse "out" | Where-Object { -not $_.PSIsContainer }).Count
$totalSize = [math]::Round((Get-ChildItem -Recurse "out" | Measure-Object -Property Length -Sum).Sum / 1MB, 2)

Write-Host "📁 Archivos generados: $fileCount" -ForegroundColor White
Write-Host "💾 Tamaño total: $totalSize MB" -ForegroundColor White

# 6. 🔍 Verificar archivos críticos
Write-Host "`n🔍 Verificando archivos críticos..." -ForegroundColor Yellow
$criticalFiles = @(
    "out/index.html",
    "out/admin/index.html", 
    "out/diagnostico/index.html",
    "out/manifest.json",
    "out/robots.txt",
    "out/sitemap.xml"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file" -ForegroundColor Red
    }
}

# 7. 🚀 Push a GitHub (trigger deployment)
Write-Host "`n🚀 Enviando cambios a GitHub..." -ForegroundColor Yellow
git add .
git status

$commitMessage = "🚀 Azure SWA optimizado: Build $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMessage

Write-Host "`n📤 Pushing to main branch..." -ForegroundColor Yellow
git push origin main

# 8. 🌐 URLs de verificación
Write-Host "`n🌐 URLs para verificar deployment:" -ForegroundColor Cyan
Write-Host "🔗 Producción: https://lively-hill-009fd0b0f.2.azurestaticapps.net" -ForegroundColor White
Write-Host "🔗 GitHub Actions: https://github.com/lopezjhonf/app-conductores/actions" -ForegroundColor White
Write-Host "🔗 Azure Portal: https://portal.azure.com" -ForegroundColor White

Write-Host "`n✨ Deployment optimizado completado!" -ForegroundColor Green
Write-Host "⏳ Azure SWA procesará el deployment automáticamente..." -ForegroundColor Yellow