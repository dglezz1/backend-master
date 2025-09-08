# Frimousse Pâtisserie - Sistema de Cotizaciones

Sistema web moderno para cotizaciones de pasteles con visualización dinámica y almacenamiento local de imágenes.

## 🚀 Características

- **Visualización Dinámica**: Cotizaciones 100% en línea con interfaz web moderna
- **Galería de Imágenes**: Visualización de imágenes con zoom completo
- **Almacenamiento Local**: Sin dependencias externas como Cloudinary
- **Containerización**: Deploy fácil con Docker
- **Base de Datos SQLite**: Configuración simple y portable

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn
- Docker (opcional, para deploy)

## 🛠️ Instalación Local

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd backend-master
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar base de datos
```bash
npx prisma generate
npx prisma db push
```

### 4. Iniciar servidor de desarrollo
```bash
npm run start:dev
```

La aplicación estará disponible en: http://localhost:3000

## 🐳 Deploy con Docker

### Opción 1: Script de Deploy Automático
```bash
./deploy.sh
```

### Opción 2: Manual
```bash
# Construir imagen
docker-compose build

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f app
```

### Detener servicios
```bash
docker-compose down
```

## 📁 Estructura del Proyecto

```
├── src/
│   ├── quotes/           # Módulo principal de cotizaciones
│   ├── prisma.service.ts # Servicio de base de datos
│   ├── view.controller.ts # Controlador para vistas HTML
│   └── main.ts          # Configuración principal
├── prisma/
│   ├── schema.prisma    # Esquema de base de datos
│   └── dev.db          # Base de datos SQLite
├── public/
│   ├── index.html      # Formulario principal
│   ├── cotizacion-view.html # Vista dinámica de cotizaciones
│   └── assets/         # CSS, JS, imágenes
├── uploads/            # Almacenamiento local de imágenes
├── docker-compose.yml  # Configuración Docker
├── Dockerfile         # Imagen Docker
└── deploy.sh         # Script de deploy automático
```

## 🎨 Funcionalidades

### Formulario de Cotización
- Información del cliente
- Selección de tipo de pastel
- Subida de imágenes de referencia
- Detalles de entrega

### Visualización Dinámica
- Vista web moderna de la cotización
- Galería de imágenes con zoom
- Enlaces directos de WhatsApp
- Información completa del pedido

### API Endpoints
- `POST /api/quotes` - Crear cotización
- `GET /api/quotes/:id/view-data` - Datos de cotización (JSON)
- `GET /cotizacion/view/:id` - Vista HTML de cotización
- `GET /api/quotes/:id/pdf` - Generar PDF

## 🔧 Configuración

### Variables de Entorno
```env
NODE_ENV=production
PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL=file:./prisma/dev.db
```

### Base de Datos
El sistema usa SQLite por defecto para simplicidad. La base de datos se crea automáticamente.

### Almacenamiento de Imágenes
Las imágenes se almacenan localmente en la carpeta `uploads/` y se sirven como archivos estáticos.

## 📱 Uso

1. **Crear Cotización**: Llenar el formulario en la página principal
2. **Ver Cotización**: Usar el enlace generado o acceder directamente a `/cotizacion/view/:id`
3. **Compartir**: Usar el enlace de WhatsApp generado automáticamente

## 🛠️ Desarrollo

### Comandos útiles
```bash
# Desarrollo con hot reload
npm run start:dev

# Compilar
npm run build

# Producción
npm run start:prod

# Linting
npm run lint

# Formatear código
npm run format

# Regenerar cliente Prisma
npx prisma generate

# Reset base de datos
npx prisma db push --force-reset
```

## 🚢 Deploy en Servidor

### 1. Subir archivos al servidor
```bash
scp -r . user@server:/path/to/app
```

### 2. Ejecutar deploy
```bash
cd /path/to/app
./deploy.sh
```

### 3. Configurar proxy reverso (nginx)
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📞 Soporte

Para soporte técnico, contactar al desarrollador del sistema.

---

**Frimousse Pâtisserie** - Sistema desarrollado para cotizaciones modernas de pasteles

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
