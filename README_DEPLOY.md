# 🎂 Frimousse Pâtisserie - Sistema de Cotizaciones

Sistema moderno de cotizaciones para pasteles con visualización dinámica online, almacenamiento local de imágenes y arquitectura containerizada.

## ✨ Características

- **Formulario de cotización** con carga de imágenes de referencia
- **Visualización dinámica online** sin necesidad de PDFs
- **Galería de imágenes** con vista a tamaño completo
- **Descarga individual o múltiple** de imágenes
- **Almacenamiento local** (sin dependencias de servicios externos)
- **Arquitectura modular** con NestJS
- **Deploy con Docker** para fácil migración
- **Base de datos SQLite** embebida

## 🚀 Deploy Rápido

### Opción 1: Script Automático
```bash
chmod +x deploy.sh
./deploy.sh
```

### Opción 2: Comandos Manuales
```bash
# Construir imagen
docker-compose build

# Iniciar aplicación
docker-compose up -d

# Ver logs
docker-compose logs -f
```

## 📋 Requisitos

- Docker 20.0+
- Docker Compose 2.0+
- Puerto 3000 disponible

## 🌐 URLs del Sistema

- **Formulario de cotización**: http://localhost:3000
- **Visualizar cotización**: http://localhost:3000/cotizacion/view/{id}
- **API REST**: http://localhost:3000/api
- **Documentación Swagger**: http://localhost:3000/api/docs

## 📁 Estructura del Proyecto

```
backend-master/
├── src/
│   ├── quotes/          # Módulo de cotizaciones
│   ├── files/           # Módulo de gestión de archivos
│   │   ├── files.service.ts      # Servicio general de archivos
│   │   ├── images.service.ts     # Servicio específico de imágenes
│   │   └── *.controller.ts       # Controladores REST
│   └── view.controller.ts        # Vistas web
├── public/              # Frontend estático
│   ├── cotizacion-view.html      # Visualizador dinámico
│   └── assets/css/quote-viewer.css
├── prisma/              # Base de datos SQLite
├── uploads/             # Almacenamiento de imágenes
├── docker-compose.yml   # Configuración de contenedores
├── Dockerfile          # Imagen Docker
└── deploy.sh           # Script de deploy
```

## 🔧 API Endpoints

### Cotizaciones
- `POST /api/quotes` - Crear cotización con imágenes
- `GET /api/quotes/:id/view-data` - Datos para visualización
- `GET /api/quotes/:id/images` - Lista de imágenes de cotización
- `GET /api/quotes/:id/images/:filename/download` - Descargar imagen específica

### Archivos e Imágenes
- `POST /api/files/upload` - Subir archivos
- `GET /api/files/:filename/download` - Descargar archivo
- `POST /api/images/upload` - Subir imágenes (con validación)
- `GET /api/images/:filename/download` - Descargar imagen

### Vistas Web
- `GET /cotizacion/view/:id` - Visualizador dinámico de cotización

## 💾 Migración de Datos

Los datos persisten en volúmenes Docker:
- **backend-master_db_data**: Base de datos SQLite
- **backend-master_uploads_data**: Imágenes subidas

### Para migrar a otro servidor:
1. Exportar volúmenes: `docker run --rm -v backend-master_db_data:/data -v $(pwd):/backup alpine tar czf /backup/db_backup.tar.gz -C /data .`
2. Exportar imágenes: `docker run --rm -v backend-master_uploads_data:/data -v $(pwd):/backup alpine tar czf /backup/uploads_backup.tar.gz -C /data .`
3. En el nuevo servidor, importar y ejecutar deploy

## 🔄 Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar aplicación
docker-compose restart

# Parar aplicación
docker-compose down

# Acceder al contenedor
docker-compose exec app sh

# Ver volúmenes
docker volume ls

# Backup de base de datos
docker run --rm -v backend-master_db_data:/data -v $(pwd):/backup alpine cp /data/dev.db /backup/
```

## 🛠️ Desarrollo Local (sin Docker)

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Iniciar en desarrollo
npm run start:dev
```

## 📞 Soporte

Para soporte técnico o modificaciones, contacta al desarrollador del sistema.

---

**Frimousse Pâtisserie** - Sistema de cotizaciones automatizado
