#!/bin/bash

# Script de Restore para Frimousse Backend
BACKUP_DIR="./backups"

echo "📥 Iniciando restore de Frimousse Backend..."

# Verificar que existe el directorio de backups
if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ No se encontró el directorio de backups: $BACKUP_DIR"
    exit 1
fi

# Listar backups disponibles
echo "📋 Backups disponibles:"
ls -la $BACKUP_DIR/*.tar.gz 2>/dev/null

# Solicitar timestamp del backup
echo ""
read -p "Ingresa el timestamp del backup a restaurar (formato: YYYYMMDD_HHMMSS): " TIMESTAMP

if [ -z "$TIMESTAMP" ]; then
    echo "❌ Timestamp requerido"
    exit 1
fi

# Verificar que existen los archivos de backup
DB_BACKUP="$BACKUP_DIR/db_backup_$TIMESTAMP.tar.gz"
UPLOADS_BACKUP="$BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz"

if [ ! -f "$DB_BACKUP" ]; then
    echo "❌ No se encontró el backup de base de datos: $DB_BACKUP"
    exit 1
fi

if [ ! -f "$UPLOADS_BACKUP" ]; then
    echo "❌ No se encontró el backup de imágenes: $UPLOADS_BACKUP"
    exit 1
fi

# Parar la aplicación si está corriendo
echo "🛑 Parando aplicación..."
docker-compose down

# Restaurar base de datos
echo "💾 Restaurando base de datos..."
docker run --rm \
  -v backend-master_db_data:/data \
  -v $(pwd)/$BACKUP_DIR:/backup \
  alpine sh -c "rm -rf /data/* && tar xzf /backup/db_backup_$TIMESTAMP.tar.gz -C /data"

# Restaurar imágenes
echo "🖼️ Restaurando imágenes..."
docker run --rm \
  -v backend-master_uploads_data:/data \
  -v $(pwd)/$BACKUP_DIR:/backup \
  alpine sh -c "rm -rf /data/* && tar xzf /backup/uploads_backup_$TIMESTAMP.tar.gz -C /data"

# Iniciar aplicación
echo "🚀 Iniciando aplicación..."
docker-compose up -d

echo "✅ Restore completado!"
echo "🌐 La aplicación debería estar disponible en http://localhost:3000"
