# Dockerfile para NestJS
FROM node:20-slim

WORKDIR /usr/src/app

# Instala Chromium y dependencias necesarias
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    sqlite3 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de configuración
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias (incluyendo dev para el build)
RUN npm ci

# Copiar código fuente
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Crear directorio de uploads con permisos correctos
RUN mkdir -p uploads && chown -R node:node uploads

# Compilar aplicación
RUN npm run build

# Limpiar dependencias de desarrollo para reducir tamaño de imagen
RUN npm ci --only=production && npm cache clean --force

# Cambiar a usuario no root
USER node

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]
