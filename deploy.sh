#!/bin/bash

# Script de Deploy para Frimousse Backend
echo "🎂 Iniciando deploy de Frimousse Backend..."

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Parar contenedores existentes si están corriendo
echo "� Parando contenedores existentes..."
docker-compose down

# Construir la imagen
echo "🔨 Construyendo imagen Docker..."
docker-compose build

# Iniciar la aplicación
echo "🚀 Iniciando aplicación..."
docker-compose up -d

# Esperar un momento para que la app inicie
echo "⏳ Esperando que la aplicación inicie..."
sleep 10

# Verificar que la aplicación esté corriendo
if curl -f http://localhost:3000/api >/dev/null 2>&1; then
    echo "✅ ¡Deploy exitoso! La aplicación está corriendo en http://localhost:3000"
    echo ""
    echo "📝 URLs importantes:"
    echo "   - API: http://localhost:3000/api"
    echo "   - Formulario: http://localhost:3000"
    echo "   - Documentación Swagger: http://localhost:3000/api/docs (si está habilitada)"
    echo ""
    echo "� Volúmenes Docker creados:"
    echo "   - backend-master_uploads_data: Para almacenamiento de imágenes"
    echo "   - backend-master_db_data: Para base de datos SQLite"
    echo ""
    echo "🔧 Comandos útiles:"
    echo "   - Ver logs: docker-compose logs -f"
    echo "   - Parar app: docker-compose down"
    echo "   - Reiniciar: docker-compose restart"
else
    echo "❌ Error: La aplicación no está respondiendo en http://localhost:3000/api"
    echo "📋 Ejecuta 'docker-compose logs' para ver los logs de error"
    exit 1
fi
