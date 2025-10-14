# Script de Limpieza - Sistema de Territorios
# Elimina archivos obsoletos identificados en la auditoría

Write-Host "INICIANDO LIMPIEZA DE ARCHIVOS OBSOLETOS..." -ForegroundColor Cyan

# Función para eliminar archivo
function Remove-ObsoleteFile {
    param([string]$FilePath, [string]$Description)
    
    if (Test-Path $FilePath) {
        try {
            Remove-Item $FilePath -Force
            Write-Host "Eliminado: $Description" -ForegroundColor Green
            return $true
        }
        catch {
            Write-Host "Error eliminando: $FilePath" -ForegroundColor Red
            return $false
        }
    }
    else {
        Write-Host "No encontrado: $FilePath" -ForegroundColor Yellow
        return $false
    }
}

$TotalFiles = 0
$DeletedFiles = 0

Write-Host "`nELIMINANDO DOCUMENTACION FRAGMENTADA..." -ForegroundColor Magenta

# Documentación fragmentada que será consolidada en docs/
$DocFiles = @(
    @{ Path = "CONFIGURACION_GOOGLE_OAUTH.md"; Desc = "Config OAuth" },
    @{ Path = "CREDENCIALES_SISTEMA.md"; Desc = "Credenciales" },
    @{ Path = "FIREBASE_ADMIN_SETUP.md"; Desc = "Setup Firebase" },
    @{ Path = "FIREBASE_MIGRATION_PLAN.md"; Desc = "Plan migración" },
    @{ Path = "FIREBASE_MIGRATION_READY.md"; Desc = "Migración ready" },
    @{ Path = "INSTRUCCIONES_DATOS_CSV.md"; Desc = "Instrucciones CSV" },
    @{ Path = "OPTIMIZACIONES_RENDIMIENTO.md"; Desc = "Optimizaciones" },
    @{ Path = "PHONE_NUMBER_CONSOLIDATION.md"; Desc = "Consolidación teléfonos" },
    @{ Path = "RESUMEN_IMPLEMENTACION.md"; Desc = "Resumen implementación" },
    @{ Path = "SELECCION-MULTIPLE.md"; Desc = "Selección múltiple" }
)

foreach ($file in $DocFiles) {
    $TotalFiles++
    if (Remove-ObsoleteFile $file.Path $file.Desc) { $DeletedFiles++ }
}

Write-Host "`nELIMINANDO ARCHIVOS DE DESARROLLO OBSOLETOS..." -ForegroundColor Magenta

# Archivos de desarrollo y configuración obsoletos
$DevFiles = @(
    @{ Path = "S-13_S.docx"; Desc = "Documento Word obsoleto" },
    @{ Path = "S-13_S.pdf"; Desc = "PDF obsoleto" },
    @{ Path = "launch-firebase.bat"; Desc = "Launcher obsoleto" }
)

foreach ($file in $DevFiles) {
    $TotalFiles++
    if (Remove-ObsoleteFile $file.Path $file.Desc) { $DeletedFiles++ }
}

# Mostrar resumen
Write-Host "`nRESUMEN DE LIMPIEZA:" -ForegroundColor Cyan
Write-Host "Total archivos procesados: $TotalFiles" -ForegroundColor White
Write-Host "Archivos eliminados: $DeletedFiles" -ForegroundColor Green
Write-Host "Tasa de éxito: $([math]::Round(($DeletedFiles/$TotalFiles)*100, 1))%" -ForegroundColor Yellow

if ($DeletedFiles -gt 0) {
    Write-Host "`nLIMPIEZA COMPLETADA CON ÉXITO!" -ForegroundColor Green
    Write-Host "Se eliminaron $DeletedFiles archivos obsoletos" -ForegroundColor Green
}

Write-Host "`nNUEVA ESTRUCTURA:" -ForegroundColor Cyan
Write-Host "- src/ (código fuente)" -ForegroundColor Green  
Write-Host "- docs/ (documentación consolidada)" -ForegroundColor Green
Write-Host "- scripts/ (automatización)" -ForegroundColor Green
Write-Host "- public/ (assets)" -ForegroundColor Green

Write-Host "`nSIGUIENTES PASOS:" -ForegroundColor Cyan
Write-Host "1. Ejecutar: npm run build" -ForegroundColor Yellow
Write-Host "2. Ejecutar: npm run deploy" -ForegroundColor Yellow
Write-Host "3. Verificar: https://conductores-9oct.web.app" -ForegroundColor Yellow

Write-Host "`nPROYECTO COMPLETAMENTE MODERNIZADO!" -ForegroundColor Green