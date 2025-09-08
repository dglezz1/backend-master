#!/bin/bash

# Script de Backup para Frimousse Backend
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "📦 Iniciando backup de Frimousse Backend..."

# Crear directorio de backup si no existe
mkdir -p $BACKUP_DIR

# Backup de base de datos
echo "💾 Haciendo backup de base de datos..."
docker run --rm \
  -v backend-master_db_data:/data \
  -v $(pwd)/$BACKUP_DIR:/backup \
  alpine tar czf /backup/db_backup_$TIMESTAMP.tar.gz -C /data .

# Backup de imágenes subidas
echo "🖼️ Haciendo backup de imágenes..."
docker run --rm \
  -v backend-master_uploads_data:/data \
  -v $(pwd)/$BACKUP_DIR:/backup \
  alpine tar czf /backup/uploads_backup_$TIMESTAMP.tar.gz -C /data .

# Backup de código fuente (opcional)
echo "📝 Haciendo backup de código fuente..."
tar czf $BACKUP_DIR/source_backup_$TIMESTAMP.tar.gz \
  --exclude=node_modules \
  --exclude=dist \
  --exclude=.git \
  --exclude=backups \
  --exclude=.venv \
  .

echo "✅ Backup completado!"
echo ""
echo "📁 Archivos generados:"
echo "   - $BACKUP_DIR/db_backup_$TIMESTAMP.tar.gz"
echo "   - $BACKUP_DIR/uploads_backup_$TIMESTAMP.tar.gz"
echo "   - $BACKUP_DIR/source_backup_$TIMESTAMP.tar.gz"
echo ""
echo "📤 Para migrar a otro servidor:"
echo "   1. Copia estos archivos al nuevo servidor"
echo "   2. Ejecuta restore.sh en el nuevo servidor"
