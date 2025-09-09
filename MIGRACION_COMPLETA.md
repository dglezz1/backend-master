# 🚀 Guía de Migración - Frimousse Backend

## 📋 Resumen del Sistema

Has implementado exitosamente:

✅ **Sistema de cotizaciones moderno** con visualización web dinámica  
✅ **Arquitectura modular NestJS** con servicios especializados  
✅ **Gestión de archivos e imágenes** con descarga individual/múltiple  
✅ **Almacenamiento local** (sin dependencias externas)  
✅ **Containerización Docker** para deploy fácil  
✅ **Scripts de backup/restore** automatizados  

## 🎯 Funcionalidades Principales

### 📝 Frontend
- Formulario de cotización con carga de imágenes
- Visualizador dinámico online (reemplaza PDFs)
- Galería de imágenes con vista a tamaño completo
- Botones de descarga individual y masiva de imágenes
- Diseño responsive y moderno

### 🔧 Backend (API)
- **Cotizaciones**: Crear, visualizar, obtener datos
- **Archivos**: Upload, download, gestión general
- **Imágenes**: Upload con validación, download, info
- **Base de datos**: SQLite embebida
- **Almacenamiento**: Local filesystem

### 🏗️ Arquitectura
```
📦 Módulos NestJS
├── QuotesModule (cotizaciones)
├── FilesModule (gestión de archivos)
├── ImagesService (especializado en imágenes)
└── ViewController (vistas web)
```

## 🚢 Deploy en Nuevo Servidor

### Paso 1: Preparar el Entorno
```bash
# Instalar Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt-get install docker-compose-plugin
```

### Paso 2: Transferir Archivos
```bash
# En el servidor actual, crear backup
./backup.sh

# Copiar todo el proyecto al nuevo servidor
scp -r backend-master/ usuario@nuevo-servidor:/path/to/proyecto/
```

### Paso 3: Deploy en Nuevo Servidor
```bash
cd /path/to/proyecto/backend-master/

# Opción A: Deploy automático
./deploy.sh

# Opción B: Deploy manual
docker-compose build
docker-compose up -d
```

### Paso 4: Restaurar Datos (si es necesario)
```bash
# Si tienes datos previos que restaurar
./restore.sh
# Ingresa el timestamp del backup cuando se solicite
```

## 🌐 URLs del Sistema Migrado

- **Formulario**: http://nuevo-servidor:3000
- **API**: http://nuevo-servidor:3000/api
- **Visualizador**: http://nuevo-servidor:3000/cotizacion/view/{id}

## 🔄 Comandos de Mantenimiento

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar aplicación
docker-compose restart

# Parar aplicación
docker-compose down

# Backup periódico
./backup.sh

# Ver estado
docker-compose ps
```

## 📊 Endpoints API Disponibles

### Cotizaciones
- `POST /api/quotes` - Crear cotización
- `GET /api/quotes/:id/view-data` - Datos para vista web
- `GET /api/quotes/:id/images` - Lista imágenes de cotización
- `GET /api/quotes/:id/images/:filename/download` - Descargar imagen

### Archivos
- `POST /api/files/upload` - Subir archivos
- `GET /api/files/:filename/download` - Descargar archivo
- `GET /api/files/:filename/info` - Info del archivo

### Imágenes
- `POST /api/images/upload` - Subir imágenes
- `GET /api/images/:filename/download` - Descargar imagen
- `GET /api/images` - Listar todas las imágenes

## 💾 Persistencia de Datos

Los datos persisten en volúmenes Docker:
- `backend-master_db_data` - Base de datos SQLite
- `backend-master_uploads_data` - Imágenes subidas

Estos volúmenes sobreviven reinicios y actualizaciones del contenedor.

## 🔐 Configuración de Producción

Para entorno de producción, edita `docker-compose.yml`:

```yaml
environment:
  NODE_ENV: production
  PUBLIC_BASE_URL: https://tu-dominio.com
  # Agregar variables adicionales si es necesario
```

## 🆘 Solución de Problemas

### Puerto 3000 ocupado
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "8080:3000"  # Usar puerto 8080 externamente
```

### Ver logs de errores
```bash
docker-compose logs app
```

### Resetear volúmenes
```bash
docker-compose down -v  # ⚠️ ELIMINA TODOS LOS DATOS
```

## ✅ Lista de Verificación Post-Migración

- [ ] La aplicación responde en http://servidor:3000
- [ ] El formulario de cotización funciona
- [ ] Se pueden subir imágenes
- [ ] La vista dinámica muestra cotizaciones correctamente
- [ ] Los botones de descarga de imágenes funcionan
- [ ] Los volúmenes Docker están creados
- [ ] Los backups se pueden generar con `./backup.sh`

## 📞 Soporte

El sistema está completamente funcional y listo para producción. Todas las dependencias están containerizadas y el sistema es completamente portable.

---

**🎂 Frimousse Pâtisserie** - Sistema de cotizaciones automatizado  
*Migración completada exitosamente* ✅
