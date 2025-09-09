import { Controller, Post, Body, UseInterceptors, UploadedFiles, BadRequestException, Res, Param, Get } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../files/images.service';
import { Response } from 'express';
import { generateQuotePdf } from './pdf.utils';
import { ApiTags, ApiConsumes, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

/**
 * Controlador para cotizaciones de pasteles
 */
@ApiTags('Cotizaciones')
@Controller('quotes')
export class QuotesController {
  constructor(
    private readonly quotesService: QuotesService,
    private readonly imagesService: ImagesService
  ) {}

  /**
   * Recibe la cotización y archivos del formulario
   */
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos de la cotización y archivos de imagen',
    type: CreateQuoteDto,
  })
  @ApiResponse({ status: 201, description: 'Cotización creada correctamente.' })
  @UseInterceptors(AnyFilesInterceptor())
  async createQuote(
    @Body() body: CreateQuoteDto,
    @UploadedFiles() files: Array<any>
  ) {
    try {
      // Procesar archivos usando el servicio de imágenes
      let imageUrls: string[] = [];
      if (files && files.length > 0) {
        const uploadResults = await this.imagesService.saveImages(files);
        imageUrls = uploadResults.map((result) => result.url);
      }
      // Convertir guests a número si viene como string
      const guests = typeof body.guests === 'string' ? parseInt(body.guests, 10) : body.guests;
      // Convertir allergies y agreement a booleano si vienen como string
      const allergies = typeof body.allergies === 'string' ? (body.allergies === 'true' || body.allergies === 'yes') : !!body.allergies;
      const agreement = typeof body.agreement === 'string' ? (body.agreement === 'true' || body.agreement === 'yes') : !!body.agreement;
      const quote = await this.quotesService.createQuote({ ...body, guests, allergies, agreement, imageUrls: JSON.stringify(imageUrls) });
      // Generar número de cotización: fecha (ddmmyy) + id usando createdAt
      let quoteNumber = '';
      if (quote.createdAt && quote.id) {
        const now = new Date(quote.createdAt);
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear()).slice(-2);
        quoteNumber = `${day}${month}${year}-${quote.id}`;
      }
      // Banner visual para frontend con botones de WhatsApp y vista web (en lugar de PDF)
      const viewUrl = `/cotizacion/view/${quote.id}`;
      const pdfUrl = `/api/quotes/${quote.id}/pdf`;
      const whatsappNumber = '+52 771-722-7089';
      // Mensaje con enlace único para la vista web
      const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';
      const fullViewUrl = `${baseUrl}${viewUrl}`;
      const whatsappMessage = encodeURIComponent(`Hola Frimousse, me interesa cotizar un pastel. Aquí está mi cotización: ${fullViewUrl}`);
      const whatsappLink = `https://wa.me/527717227089?text=${whatsappMessage}`;
      return {
        success: true,
        data: {
          quoteNumber,
          whatsappNumber,
          viewUrl: fullViewUrl,
          pdfUrl,
          quote,
          banner: {
            logo: '/assets/img/FRIMOUSSE_PATISSERIE__2_-removebg-preview.png',
            title: '¡Cotización enviada!',
            subtitle: 'Tu cotización está lista',
            message: 'Puedes ver tu cotización en línea o contactarnos por WhatsApp para recibir tu precio final.',
            whatsappLink,
            viewUrl: fullViewUrl,
            brand: 'Frimousse Pâtisserie · Cotización generada automáticamente'
          }
        }
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  /**
   * Vista previa del PDF en el navegador (inline)
   */
  @Get(':id/pdf/preview')
  @ApiParam({ name: 'id', description: 'ID de la cotización' })
  @ApiResponse({ status: 200, description: 'Vista previa PDF.' })
  async previewQuotePdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const quote = await this.quotesService.getQuoteById(Number(id));
      if (!quote) {
        throw new BadRequestException('Cotización no encontrada');
      }
      let pdfBuffer;
      try {
        pdfBuffer = await generateQuotePdf(quote);
      } catch (pdfErr) {
        // Loguea el error de PDF
        console.error('Error al generar PDF (preview):', pdfErr);
        throw new BadRequestException('Error interno al generar el PDF (preview): ' + (pdfErr?.message || pdfErr));
      }
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="cotizacion_${id}.pdf"`,
      });
      res.end(pdfBuffer);
    } catch (err) {
      // Loguea el error general
      console.error('Error en previewQuotePdf:', err);
      throw err;
    }
  }

  /**
   * Sirve la vista HTML de la cotización
   */
  @Get(':id/view-page')
  @ApiParam({ name: 'id', description: 'ID de la cotización' })
  @ApiResponse({ status: 200, description: 'Vista HTML de la cotización.' })
  async getQuoteViewPage(@Param('id') id: string, @Res() res: Response) {
    try {
      const quote = await this.quotesService.getQuoteById(Number(id));
      if (!quote) {
        throw new BadRequestException('Cotización no encontrada');
      }

      // Servir el archivo HTML
      const path = require('path');
      const fs = require('fs');
      const htmlPath = path.join(process.cwd(), 'public', 'cotizacion-view.html');
      
      if (fs.existsSync(htmlPath)) {
        res.sendFile(htmlPath);
      } else {
        throw new BadRequestException('Vista no encontrada');
      }
    } catch (err) {
      console.error('Error en getQuoteViewPage:', err);
      throw err;
    }
  }

  /**
   * Obtiene los datos de la cotización en formato JSON
   */
  @Get(':id/view-data')
  @ApiParam({ name: 'id', description: 'ID de la cotización' })
  @ApiResponse({ status: 200, description: 'Datos de cotización obtenidos correctamente.' })
  async getQuoteView(@Param('id') id: string) {
    try {
      console.log('getQuoteView called with id:', id, 'type:', typeof id);
      const quote = await this.quotesService.getQuoteById(Number(id));
      if (!quote) {
        throw new BadRequestException('Cotización no encontrada');
      }

      // Generar número de cotización
      let quoteNumber = '';
      if (quote.createdAt && quote.id) {
        const now = new Date(quote.createdAt);
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear()).slice(-2);
        quoteNumber = `${day}${month}${year}-${quote.id}`;
      }

      // Enlaces de WhatsApp
      const whatsappNumber = '+52 771-722-7089';
      const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';
      const viewUrl = `${baseUrl}/cotizacion/view/${quote.id}`;
      const whatsappMessage = encodeURIComponent(`Hola Frimousse, me interesa cotizar un pastel. Aquí está mi cotización: ${viewUrl}`);
      const whatsappLink = `https://wa.me/527717227089?text=${whatsappMessage}`;

      let imageUrls: string[] = [];
      try {
        imageUrls = quote.imageUrls ? JSON.parse((quote.imageUrls as unknown) as string) : [];
      } catch (e) {
        console.error('Error parsing imageUrls:', e);
        imageUrls = [];
      }
      
      return {
        success: true,
        data: {
          quote: {
            ...quote,
            imageUrls: imageUrls
          },
          quoteNumber,
          whatsappNumber,
          whatsappLink,
          viewUrl
        }
      };
    } catch (err) {
      console.error('Error en getQuoteView:', err);
      throw err;
    }
  }

  /**
   * Genera y descarga el PDF de la cotización
   */
  @Get(':id/pdf')
  @ApiParam({ name: 'id', description: 'ID de la cotización' })
  @ApiResponse({ status: 200, description: 'PDF generado correctamente.' })
  async getQuotePdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const quote = await this.quotesService.getQuoteById(Number(id));
      if (!quote) {
        throw new BadRequestException('Cotización no encontrada');
      }
      let pdfBuffer;
      try {
        pdfBuffer = await generateQuotePdf(quote);
      } catch (pdfErr) {
        // Loguea el error de PDF
        console.error('Error al generar PDF (descarga):', pdfErr);
        throw new BadRequestException('Error interno al generar el PDF (descarga): ' + (pdfErr?.message || pdfErr));
      }
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="cotizacion_${id}.pdf"`,
      });
      res.end(pdfBuffer);
    } catch (err) {
      // Loguea el error general
      console.error('Error en getQuotePdf:', err);
      throw err;
    }
  }

  /**
   * Obtiene información de las imágenes de una cotización
   */
  @Get(':id/images')
  @ApiParam({ name: 'id', description: 'ID de la cotización' })
  @ApiResponse({ status: 200, description: 'Información de imágenes de la cotización.' })
  async getQuoteImages(@Param('id') id: string) {
    try {
      const quote = await this.quotesService.getQuoteById(Number(id));
      if (!quote) {
        throw new BadRequestException('Cotización no encontrada');
      }

      const images = await this.imagesService.getImagesInfo(quote.imageUrls);
      
      return {
        success: true,
        quoteId: quote.id,
        totalImages: images.length,
        images: images.map(img => ({
          filename: img.filename,
          originalName: img.originalName,
          url: img.url,
          downloadUrl: `/images/${img.filename}/download`,
          size: img.size,
          mimetype: img.mimetype
        }))
      };
    } catch (err) {
      console.error('Error en getQuoteImages:', err);
      throw err;
    }
  }

  /**
   * Descarga una imagen específica de una cotización
   */
  @Get(':id/images/:filename/download')
  @ApiParam({ name: 'id', description: 'ID de la cotización' })
  @ApiParam({ name: 'filename', description: 'Nombre del archivo de imagen' })
  @ApiResponse({ status: 200, description: 'Imagen descargada correctamente.' })
  async downloadQuoteImage(
    @Param('id') id: string, 
    @Param('filename') filename: string, 
    @Res() res: Response
  ) {
    try {
      // Verificar que la cotización existe
      const quote = await this.quotesService.getQuoteById(Number(id));
      if (!quote) {
        throw new BadRequestException('Cotización no encontrada');
      }

      // Verificar que la imagen pertenece a esta cotización
      const imageUrls = this.imagesService.extractImageUrls(quote.imageUrls);
      const filenames = this.imagesService.extractFilenamesFromUrls(imageUrls);
      
      if (!filenames.includes(filename)) {
        throw new BadRequestException('La imagen no pertenece a esta cotización');
      }

      // Descargar la imagen
      const fileData = await this.imagesService.downloadFile(filename);
      
      res.setHeader('Content-Type', fileData.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName}"`);
      
      return res.sendFile(fileData.path);
    } catch (err) {
      console.error('Error en downloadQuoteImage:', err);
      throw err;
    }
  }
}
