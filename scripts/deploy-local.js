#!/usr/bin/env node

/**
 * 🚀 Script de Deploy Local para Azure Static Web Apps
 * Permite testear el deployment antes de subir a GitHub
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AZURE SWA LOCAL DEPLOYMENT SCRIPT');
console.log('=====================================\n');

// Verificar que estamos en la carpeta correcta
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: No se encuentra package.json');
  console.error('   Ejecuta este script desde la raíz del proyecto');
  process.exit(1);
}

try {
  // 1. Limpiar build anterior
  console.log('🧹 Limpiando build anterior...');
  if (fs.existsSync('dist')) {
    execSync('rm -rf dist', { stdio: 'inherit' });
  }

  // 2. Instalar dependencias
  console.log('📦 Instalando dependencias...');
  execSync('npm ci --prefer-offline --no-audit', { stdio: 'inherit' });

  // 3. Build de producción
  console.log('🏗️  Generando build de producción...');
  execSync('npm run build', { stdio: 'inherit' });

  // 4. Verificar build
  console.log('✅ Verificando archivos generados...');
  const distStats = fs.statSync('dist');
  const files = fs.readdirSync('dist').length;
  console.log(`   📁 Archivos generados: ${files}`);
  console.log(`   📊 Directorio dist creado: ${distStats.isDirectory() ? 'Sí' : 'No'}`);

  // 5. Verificar archivos críticos
  const criticalFiles = [
    'dist/index.html',
    'dist/_next/static',
    'dist/admin/index.html',
    'dist/manifest.json'
  ];

  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ⚠️  ${file} (opcional)`);
    }
  });

  // 6. Iniciar servidor local de testing
  console.log('\n🌐 Iniciando servidor local de testing...');
  console.log('   URL: http://localhost:4280');
  console.log('   Presiona CTRL+C para detener\n');
  
  execSync('swa start ./dist --port 4280', { stdio: 'inherit' });

} catch (error) {
  console.error('❌ Error durante el deployment local:');
  console.error(error.message);
  process.exit(1);
}