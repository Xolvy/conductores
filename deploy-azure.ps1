# 🚀 Deploy Script para Azure SWA
# Uso: .\deploy-azure.ps1

Write-Host "🚀 AZURE SWA DEPLOYMENT SCRIPT" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

try {
    # Verificar que estamos en la carpeta correcta
    if (!(Test-Path "package.json")) {
        Write-Host "❌ Error: No se encuentra package.json" -ForegroundColor Red
        Write-Host "   Ejecuta este script desde la raíz del proyecto" -ForegroundColor Yellow
        exit 1
    }

    # 1. Limpiar build anterior
    Write-Host "🧹 Limpiando build anterior..." -ForegroundColor Yellow
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist"
    }

    # 2. Instalar dependencias
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm ci --prefer-offline --no-audit
    if ($LASTEXITCODE -ne 0) { throw "Error instalando dependencias" }

    # 3. Build de producción
    Write-Host "🏗️ Generando build de producción..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Error en build" }

    # 4. Verificar build
    Write-Host "✅ Verificando archivos generados..." -ForegroundColor Green
    $files = (Get-ChildItem "dist" -Recurse | Measure-Object).Count
    Write-Host "   📁 Archivos generados: $files" -ForegroundColor White
    
    # 5. Verificar archivos críticos
    $criticalFiles = @(
        "dist\index.html",
        "dist\_next\static",
        "dist\admin\index.html", 
        "dist\manifest.json"
    )

    foreach ($file in $criticalFiles) {
        if (Test-Path $file) {
            Write-Host "   ✅ $file" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ $file (opcional)" -ForegroundColor Yellow
        }
    }

    # 6. Mostrar estadísticas
    $distSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum
    $distSizeMB = [math]::Round($distSize / 1MB, 2)
    Write-Host "   💾 Tamaño total: $distSizeMB MB" -ForegroundColor White

    Write-Host ""
    Write-Host "🎉 ¡BUILD COMPLETADO EXITOSAMENTE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "   1. Sube el código a GitHub: git push origin main" -ForegroundColor White
    Write-Host "   2. Ve a GitHub Actions para ver el deployment" -ForegroundColor White
    Write-Host "   3. Revisa Azure Portal para la URL pública" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Para testing local:" -ForegroundColor Cyan
    Write-Host "   swa start ./dist --port 4280" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host "❌ Error durante el deployment:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}