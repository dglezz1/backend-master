
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // Cargar variables de entorno antes de crear la app
  require('dotenv').config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Servir archivos estáticos desde /public
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // Servir archivos subidos desde /uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Prefijo global para la API (excluyendo rutas de vista)
  app.setGlobalPrefix('api', {
    exclude: ['/cotizacion/view/:id']
  });

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('API Cotizaciones Frimousse')
    .setDescription('API para cotizaciones de pasteles, subida de imágenes y generación de PDF')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
