# 🚀 Dockerfile optimizado para producción - App Conductores 2025
# Usando multi-stage build para optimizar el tamaño final

# ==============================================
# 🏗️ STAGE 1: Dependencies
# ==============================================
FROM node:20-alpine AS deps
LABEL maintainer="App Conductores Team"
LABEL description="Sistema de gestión de territorios y predicación telefónica"

# Instalar solo las dependencias necesarias para alpine
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY yarn.lock* ./

# Instalar dependencias usando npm ci para builds más rápidos
RUN npm ci --only=production --frozen-lockfile

# ==============================================
# 🏗️ STAGE 2: Builder  
# ==============================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependencias desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Variables de entorno para el build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build de la aplicación
RUN npm run build

# ==============================================
# 🚀 STAGE 3: Runner (Producción)
# ==============================================
FROM node:20-alpine AS runner
WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copiar archivos de build con permisos correctos
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Variables de entorno para producción
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "server.js"]

# ==============================================
# 📊 Metadatos y configuración
# ==============================================
LABEL version="1.0.0"
LABEL environment="production"
LABEL app="conductores-territorios"
LABEL features="firebase,nextjs,typescript,tailwindcss"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js
