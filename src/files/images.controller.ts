import { 
  Controller, 
  Get, 
  Param, 
  Res, 
  NotFoundException, 
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Delete
} from '@nestjs/common';
import { Response } from 'express';
import { ImagesService } from './images.service';
import { ApiTags, ApiParam, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /**
   * Descarga una imagen específica
   */
  @Get(':filename/download')
  @ApiParam({ name: 'filename', description: 'Nombre de la imagen a descargar' })
  @ApiResponse({ status: 200, description: 'Imagen descargada correctamente.' })
  @ApiResponse({ status: 404, description: 'Imagen no encontrada.' })
  async downloadImage(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const fileData = await this.imagesService.downloadFile(filename);
      
      // Para imágenes, podemos usar inline para mostrar en navegador o attachment para forzar descarga
      res.setHeader('Content-Type', fileData.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName}"`);
      
      return res.sendFile(fileData.path);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error downloading image');
    }
  }

  /**
   * Descarga múltiples imágenes como ZIP (futuro feature)
   */
  @Get('download-multiple/:imageIds')
  @ApiParam({ name: 'imageIds', description: 'IDs de imágenes separados por comas' })
  @ApiResponse({ status: 200, description: 'Imágenes descargadas como ZIP.' })
  async downloadMultipleImages(@Param('imageIds') imageIds: string, @Res() res: Response) {
    // TODO: Implementar descarga como ZIP
    throw new BadRequestException('Feature not implemented yet');
  }

  /**
   * Sube imágenes
   */
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Imágenes a subir',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imágenes subidas correctamente.' })
  @UseInterceptors(AnyFilesInterceptor())
  async uploadImages(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided');
    }

    try {
      const results = await this.imagesService.saveImages(files);
      
      return {
        success: true,
        message: `${results.length} image(s) uploaded successfully`,
        images: results,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Obtiene información de una imagen
   */
  @Get(':filename/info')
  @ApiParam({ name: 'filename', description: 'Nombre de la imagen' })
  @ApiResponse({ status: 200, description: 'Información de la imagen.' })
  @ApiResponse({ status: 404, description: 'Imagen no encontrada.' })
  async getImageInfo(@Param('filename') filename: string) {
    return await this.imagesService.getFileInfo(filename);
  }

  /**
   * Lista todas las imágenes
   */
  @Get()
  @ApiResponse({ status: 200, description: 'Lista de imágenes.' })
  async listImages() {
    const allFiles = await this.imagesService.listFiles();
    // Filtrar solo imágenes basado en mimetype
    return allFiles.filter(file => file.mimetype.startsWith('image/'));
  }

  /**
   * Elimina una imagen
   */
  @Delete(':filename')
  @ApiParam({ name: 'filename', description: 'Nombre de la imagen a eliminar' })
  @ApiResponse({ status: 200, description: 'Imagen eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Imagen no encontrada.' })
  async deleteImage(@Param('filename') filename: string) {
    const deleted = await this.imagesService.deleteFile(filename);
    
    if (!deleted) {
      throw new NotFoundException('Image not found');
    }

    return {
      success: true,
      message: 'Image deleted successfully',
    };
  }
}
