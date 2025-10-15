# 🚀 Deployment Manual de Emergencia - Azure Static Web Apps

Write-Host "🔥 DEPLOYMENT MANUAL DE EMERGENCIA" -ForegroundColor Red
Write-Host "Este script despliega directamente sin GitHub Actions" -ForegroundColor Yellow

# 1. Verificar que el build existe
if (-not (Test-Path "out/index.html")) {
    Write-Host "❌ No se encontró el build. Ejecutando npm run build..." -ForegroundColor Red
    npm run build
}

# 2. Verificar archivos críticos
Write-Host "`n🔍 Verificando archivos críticos..." -ForegroundColor Cyan
$criticalFiles = @("out/index.html", "out/admin/index.html", "out/_next")
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file existe" -ForegroundColor Green
    } else {
        Write-Host "❌ $file falta" -ForegroundColor Red
    }
}

# 3. Mostrar estadísticas
$fileCount = (Get-ChildItem -Recurse "out" | Where-Object { -not $_.PSIsContainer }).Count
$totalSize = [math]::Round((Get-ChildItem -Recurse "out" | Measure-Object -Property Length -Sum).Sum / 1MB, 2)
Write-Host "`n📊 Estadísticas del build:" -ForegroundColor Cyan
Write-Host "📁 Archivos: $fileCount" -ForegroundColor White
Write-Host "💾 Tamaño: $totalSize MB" -ForegroundColor White

# 4. Instrucciones para deployment manual
Write-Host "`n🛠️ OPCIONES DE DEPLOYMENT MANUAL:" -ForegroundColor Yellow

Write-Host "`n1️⃣ Via Azure Portal:" -ForegroundColor Cyan
Write-Host "   - Ve a: https://portal.azure.com" -ForegroundColor White
Write-Host "   - Busca tu Static Web App: lively-hill-009fd0b0f" -ForegroundColor White
Write-Host "   - Ve a 'Deployment' > 'Browse code'" -ForegroundColor White
Write-Host "   - Sube la carpeta 'out' manualmente" -ForegroundColor White

Write-Host "`n2️⃣ Via GitHub Actions (recomendado):" -ForegroundColor Cyan
Write-Host "   - Monitorea: https://github.com/Xolvy/conductores/actions" -ForegroundColor White
Write-Host "   - El último deployment debería funcionar con Node.js 20" -ForegroundColor White

Write-Host "`n3️⃣ Via VS Code Extension:" -ForegroundColor Cyan
Write-Host "   - Instala: Azure Static Web Apps extension" -ForegroundColor White
Write-Host "   - Right-click en la carpeta 'out' > Deploy to Static Web App" -ForegroundColor White

Write-Host "`n🔗 URLs para verificar:" -ForegroundColor Yellow
Write-Host "📱 App: https://lively-hill-009fd0b0f.2.azurestaticapps.net" -ForegroundColor Blue
Write-Host "🔍 Actions: https://github.com/Xolvy/conductores/actions" -ForegroundColor Blue

Write-Host "`n⏳ El GitHub Actions corregido debería completarse en ~3 minutos..." -ForegroundColor Green