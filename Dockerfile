# Dockerfile para la aplicación Full-Stack Kacum

# --- Fase 1: Construcción del Frontend ---
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependencias del frontend
COPY package*.json ./
RUN npm install

# Copiar el resto de los archivos del frontend y construir
COPY . .
RUN npm run build

# --- Fase 2: Preparación del Backend ---
FROM node:18-alpine AS backend_setup

WORKDIR /app

# Instalar dependencias del backend
COPY backend/package*.json backend/
RUN cd backend && npm install --production

# Copiar el código fuente del backend
COPY backend/ ./backend

# --- Fase 3: Ensamblaje Final ---
FROM node:18-alpine

WORKDIR /app

# Copiar dependencias y código del backend desde la fase anterior
COPY --from=backend_setup /app/backend ./backend

# Copiar el frontend construido para que sea servido por Express
# Express está configurado para servir desde 'backend/src/public/dist'
COPY --from=builder /app/dist ./backend/src/public/dist

# Exponer el puerto en el que corre el backend
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["node", "backend/src/server.js"]
