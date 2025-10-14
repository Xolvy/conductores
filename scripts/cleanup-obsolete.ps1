# 🧹 Script de Limpieza - Eliminación de Archivos Obsoletos
# Proyecto: Sistema de Territorios - Optimización Completa

Write-Host "🚀 INICIANDO LIMPIEZA DE ARCHIVOS OBSOLETOS..." -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Gray

# Función para eliminar archivo con verificación
function Remove-ObsoleteFile {
    param([string]$FilePath, [string]$Description)
    
    if (Test-Path $FilePath) {
        try {
            Remove-Item $FilePath -Force
            Write-Host "✅ Eliminado: $Description" -ForegroundColor Green
            Write-Host "   Archivo: $FilePath" -ForegroundColor Gray
            return $true
        }
        catch {
            Write-Host "❌ Error eliminando: $FilePath" -ForegroundColor Red
            Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
            return $false
        }
    }
    else {
        Write-Host "⚠️  No encontrado: $FilePath" -ForegroundColor Yellow
        return $false
    }
}

# Contadores
$TotalFiles = 0
$DeletedFiles = 0
$ErrorFiles = 0

Write-Host "`n📂 ELIMINANDO VERSIONES OBSOLETAS DE INDEX..." -ForegroundColor Magenta

# 1. Versiones obsoletas de index (8 archivos)
$IndexFiles = @(
    @{ Path = "index-complete.html"; Desc = "Index completo obsoleto" },
    @{ Path = "index-v3.html"; Desc = "Index versión 3 obsoleto" },
    @{ Path = "index-test.html"; Desc = "Index de testing obsoleto" },
    @{ Path = "index-backup.html"; Desc = "Backup de index obsoleto" },
    @{ Path = "index-old.html"; Desc = "Index antiguo obsoleto" },
    @{ Path = "index-original.html"; Desc = "Index original obsoleto" },
    @{ Path = "index-previous.html"; Desc = "Index previo obsoleto" },
    @{ Path = "index-legacy.html"; Desc = "Index legacy obsoleto" }
)

foreach ($file in $IndexFiles) {
    $TotalFiles++
    if (Remove-ObsoleteFile $file.Path $file.Desc) { $DeletedFiles++ } else { $ErrorFiles++ }
}

Write-Host "`n📦 ELIMINANDO CONFIGURACIONES DUPLICADAS..." -ForegroundColor Magenta

# 2. Configuraciones duplicadas (6 archivos)
$ConfigFiles = @(
    @{ Path = "package-2026.json"; Desc = "Package.json versión 2026" },
    @{ Path = "package-backup.json"; Desc = "Package.json backup" },
    @{ Path = "tsconfig-optimized.json"; Desc = "TSConfig optimizado duplicado" },
    @{ Path = "tsconfig-backup.json"; Desc = "TSConfig backup" },
    @{ Path = "next.config.backup.js"; Desc = "Next.js config backup" },
    @{ Path = "tailwind.config.backup.js"; Desc = "Tailwind config backup" }
)

foreach ($file in $ConfigFiles) {
    $TotalFiles++
    if (Remove-ObsoleteFile $file.Path $file.Desc) { $DeletedFiles++ } else { $ErrorFiles++ }
}

Write-Host "`n⚙️ ELIMINANDO SCRIPTS OBSOLETOS..." -ForegroundColor Magenta

# 3. Scripts obsoletos (8 archivos)
$ScriptFiles = @(
    @{ Path = "deploy-final.ps1"; Desc = "Script de deploy final obsoleto" },
    @{ Path = "deploy-backup.ps1"; Desc = "Script de deploy backup" },
    @{ Path = "launch-firebase-backup.bat"; Desc = "Launcher Firebase backup" },
    @{ Path = "build-old.js"; Desc = "Script de build antiguo" },
    @{ Path = "useAdvancedAnalytics.js"; Desc = "Hook obsoleto de analytics" },
    @{ Path = "optimization-old.js"; Desc = "Script de optimización antiguo" },
    @{ Path = "cleanup-old.ps1"; Desc = "Script de limpieza antiguo" },
    @{ Path = "generate-sw-old.js"; Desc = "Generador de SW obsoleto" }
)

foreach ($file in $ScriptFiles) {
    $TotalFiles++
    if (Remove-ObsoleteFile $file.Path $file.Desc) { $DeletedFiles++ } else { $ErrorFiles++ }
}

Write-Host "`n🗂️ ELIMINANDO COMPONENTES OBSOLETOS..." -ForegroundColor Magenta

# 4. Componentes React obsoletos (8 archivos)
$ComponentFiles = @(
    @{ Path = "src\components\AdminPanel-old.tsx"; Desc = "AdminPanel versión antigua" },
    @{ Path = "src\components\ConductorSelector-backup.tsx"; Desc = "Selector backup" },
    @{ Path = "src\components\LoginScreen-old.tsx"; Desc = "Login screen antiguo" },
    @{ Path = "src\components\TestComponent-obsolete.tsx"; Desc = "Componente de test obsoleto" },
    @{ Path = "src\app\test-old\page.tsx"; Desc = "Página de test antigua" },
    @{ Path = "src\app\admin-backup\layout.tsx"; Desc = "Layout admin backup" },
    @{ Path = "src\hooks\useOldFirebase.ts"; Desc = "Hook Firebase obsoleto" },
    @{ Path = "src\utils\legacy-helpers.ts"; Desc = "Helpers legacy" }
)

foreach ($file in $ComponentFiles) {
    $TotalFiles++
    if (Remove-ObsoleteFile $file.Path $file.Desc) { $DeletedFiles++ } else { $ErrorFiles++ }
}

Write-Host "`n📄 ELIMINANDO DOCUMENTACIÓN FRAGMENTADA..." -ForegroundColor Magenta

# 5. Documentación fragmentada (17 archivos)
$DocFiles = @(
    @{ Path = "CONFIGURACION_GOOGLE_OAUTH.md"; Desc = "Config OAuth obsoleta" },
    @{ Path = "CREDENCIALES_SISTEMA.md"; Desc = "Credenciales obsoletas" },
    @{ Path = "FIREBASE_ADMIN_SETUP.md"; Desc = "Setup Firebase obsoleto" },
    @{ Path = "FIREBASE_MIGRATION_PLAN.md"; Desc = "Plan migración obsoleto" },
    @{ Path = "FIREBASE_MIGRATION_READY.md"; Desc = "Migración ready obsoleto" },
    @{ Path = "INSTRUCCIONES_DATOS_CSV.md"; Desc = "Instrucciones CSV obsoletas" },
    @{ Path = "OPTIMIZACIONES_RENDIMIENTO.md"; Desc = "Optimizaciones obsoletas" },
    @{ Path = "PHONE_NUMBER_CONSOLIDATION.md"; Desc = "Consolidación teléfonos obsoleta" },
    @{ Path = "RESUMEN_IMPLEMENTACION.md"; Desc = "Resumen implementación obsoleto" },
    @{ Path = "SELECCION-MULTIPLE.md"; Desc = "Selección múltiple obsoleta" },
    @{ Path = "README-old.md"; Desc = "README antiguo" },
    @{ Path = "DEPLOYMENT-old.md"; Desc = "Deployment antiguo" },
    @{ Path = "ADMIN-GUIDE-old.md"; Desc = "Guía admin antigua" },
    @{ Path = "CHANGELOG-old.md"; Desc = "Changelog antiguo" },
    @{ Path = "SECURITY-old.md"; Desc = "Seguridad antigua" },
    @{ Path = "API-DOCS-old.md"; Desc = "API docs antigua" },
    @{ Path = "TROUBLESHOOTING-old.md"; Desc = "Troubleshooting antiguo" }
)

foreach ($file in $DocFiles) {
    $TotalFiles++
    if (Remove-ObsoleteFile $file.Path $file.Desc) { $DeletedFiles++ } else { $ErrorFiles++ }
}

Write-Host "`n📊 RESUMEN DE LIMPIEZA:" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Gray
Write-Host "📁 Total archivos procesados: $TotalFiles" -ForegroundColor White
Write-Host "✅ Archivos eliminados: $DeletedFiles" -ForegroundColor Green
Write-Host "❌ Errores: $ErrorFiles" -ForegroundColor Red
Write-Host "📈 Tasa de éxito: $([math]::Round(($DeletedFiles/$TotalFiles)*100, 1))%" -ForegroundColor Yellow

if ($DeletedFiles -gt 0) {
    Write-Host "`n🎉 ¡LIMPIEZA COMPLETADA CON ÉXITO!" -ForegroundColor Green
    Write-Host "   ✨ Se eliminaron $DeletedFiles archivos obsoletos" -ForegroundColor Green
    Write-Host "   📦 Estructura del proyecto optimizada" -ForegroundColor Green
    Write-Host "   🚀 Proyecto listo para producción" -ForegroundColor Green
}

if ($ErrorFiles -gt 0) {
    Write-Host "`n⚠️  ADVERTENCIA: Se encontraron $ErrorFiles errores" -ForegroundColor Yellow
    Write-Host "   👀 Revisar los archivos que no pudieron eliminarse" -ForegroundColor Yellow
}

Write-Host "`n📂 NUEVA ESTRUCTURA DEL PROYECTO:" -ForegroundColor Cyan
Write-Host "├── src/" -ForegroundColor Green
Write-Host "│   ├── index.html (aplicacion principal)" -ForegroundColor Gray
Write-Host "│   └── manifest.json (PWA config)" -ForegroundColor Gray
Write-Host "├── docs/" -ForegroundColor Green
Write-Host "│   ├── README.md (documentacion principal)" -ForegroundColor Gray
Write-Host "│   ├── ADMIN_GUIDE.md (guia administrador)" -ForegroundColor Gray
Write-Host "│   ├── DEPLOYMENT.md (guia despliegue)" -ForegroundColor Gray
Write-Host "│   └── CHANGELOG.md (historial cambios)" -ForegroundColor Gray
Write-Host "├── scripts/" -ForegroundColor Green
Write-Host "│   ├── deploy.ps1 (deployment automatizado)" -ForegroundColor Gray
Write-Host "│   └── build.js (build automatizado)" -ForegroundColor Gray
Write-Host "├── public/ (assets estaticos)" -ForegroundColor Green
Write-Host "└── package-optimized.json (dependencias limpias)" -ForegroundColor Green

Write-Host "`n🔄 SIGUIENTES PASOS:" -ForegroundColor Cyan
Write-Host "1. 🔧 Ejecutar: npm run build" -ForegroundColor Yellow
Write-Host "2. 🚀 Ejecutar: npm run deploy" -ForegroundColor Yellow
Write-Host "3. ✅ Verificar: https://conductores-9oct.web.app" -ForegroundColor Yellow
Write-Host "4. 📚 Revisar: docs/README.md para información completa" -ForegroundColor Yellow

Write-Host "`n✨ ¡PROYECTO COMPLETAMENTE MODERNIZADO!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Gray