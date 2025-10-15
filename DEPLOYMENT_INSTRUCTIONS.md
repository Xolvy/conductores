# 🚀 Instrucciones de Deployment a Azure SWA

## 📋 **PASO 1: Crear Repositorio en GitHub** (5 minutos)

### 1.1 Ir a GitHub

- Abre tu navegador en: https://github.com
- Haz login con tu cuenta de GitHub

### 1.2 Crear Nuevo Repositorio

- Clic en el botón **"+"** (esquina superior derecha)
- Selecciona **"New repository"**

### 1.3 Configurar Repositorio

```
Repository name: app-conductores
Description: 🚀 Sistema de gestión de territorios y predicación telefónica
Visibility: ✅ Public (recomendado para Azure SWA gratuito)
Initialize: ❌ NO marcar "Add a README file"
.gitignore: ❌ None
License: ❌ None (ya tenemos MIT license)
```

### 1.4 Crear Repositorio

- Clic **"Create repository"**
- GitHub te mostrará las instrucciones de conexión

## 📋 **PASO 2: Conectar Repositorio Local** (2 minutos)

GitHub te dará estas líneas de comando. Ejecútalas en tu terminal:

```bash
git remote add origin https://github.com/TU_USUARIO/app-conductores.git
git branch -M main
git push -u origin main
```

**Nota:** Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

## 📋 **PASO 3: Crear Azure Static Web App** (10 minutos)

### 3.1 Ir a Azure Portal

- Abre: https://portal.azure.com
- Haz login con tu cuenta de Azure

### 3.2 Crear Recurso SWA

1. Clic **"Create a resource"**
2. Buscar **"Static Web App"**
3. Clic **"Create"**

### 3.3 Configuración Básica

```
Subscription: Tu suscripción de Azure
Resource Group: Crear nuevo "rg-app-conductores"
Name: app-conductores-swa
Plan type: Free (para desarrollo)
Region: East US 2 (recomendado)
```

### 3.4 Configuración de Deployment

```
Source: GitHub
GitHub Account: [Autorizar conexión]
Organization: Tu usuario de GitHub
Repository: app-conductores
Branch: main
Build Presets: Custom
```

### 3.5 Build Details

```
App location: /
API location: (dejar vacío)
Output location: dist
```

### 3.6 Finalizar

- Clic **"Review + create"**
- Clic **"Create"**

## 🎯 **PASO 4: Verificar Deployment** (5 minutos)

### 4.1 GitHub Actions

- Ve a tu repositorio en GitHub
- Clic en la tab **"Actions"**
- Verás el workflow ejecutándose automáticamente

### 4.2 Azure Portal

- En Azure Portal, ve a tu recurso Static Web App
- Copia la **URL** que aparece en "URL"
- Esta será tu URL pública

## 🌐 **URLs Esperadas:**

Después del deployment tendrás:

- **GitHub Repo:** `https://github.com/TU_USUARIO/app-conductores`
- **Azure SWA:** `https://app-conductores-swa.azurestaticapps.net`
- **Custom Domain:** Configurable después

## 🔧 **Comandos de Utilidad:**

```bash
# Ver logs locales
git log --oneline

# Verificar remotes
git remote -v

# Push cambios futuros
git add .
git commit -m "descripción"
git push origin main
```

## ✅ **Checklist de Deployment:**

- [ ] ✅ Repositorio creado en GitHub
- [ ] ✅ Código subido a GitHub
- [ ] ✅ Azure SWA creado y conectado
- [ ] ✅ GitHub Actions ejecutándose
- [ ] ✅ App accesible en URL pública
- [ ] ✅ CI/CD funcionando automáticamente

¡Sigue estos pasos y tendrás tu app desplegada en menos de 20 minutos! 🚀
