import { 
  Controller, 
  Get, 
  Param, 
  Res, 
  NotFoundException, 
  Header,
  Delete,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException
} from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { ApiTags, ApiParam, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * Descarga un archivo específico
   */
  @Get(':filename/download')
  @ApiParam({ name: 'filename', description: 'Nombre del archivo a descargar' })
  @ApiResponse({ status: 200, description: 'Archivo descargado correctamente.' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado.' })
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const fileData = await this.filesService.downloadFile(filename);
      
      res.setHeader('Content-Type', fileData.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName}"`);
      
      return res.sendFile(fileData.path);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error downloading file');
    }
  }

  /**
   * Obtiene información de un archivo
   */
  @Get(':filename/info')
  @ApiParam({ name: 'filename', description: 'Nombre del archivo' })
  @ApiResponse({ status: 200, description: 'Información del archivo.' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado.' })
  async getFileInfo(@Param('filename') filename: string) {
    return await this.filesService.getFileInfo(filename);
  }

  /**
   * Lista todos los archivos
   */
  @Get()
  @ApiResponse({ status: 200, description: 'Lista de archivos.' })
  async listFiles() {
    return await this.filesService.listFiles();
  }

  /**
   * Sube archivos
   */
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivos a subir',
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
  @ApiResponse({ status: 201, description: 'Archivos subidos correctamente.' })
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const results = await this.filesService.saveFiles(files);
    
    return {
      success: true,
      message: `${results.length} file(s) uploaded successfully`,
      files: results,
    };
  }

  /**
   * Elimina un archivo
   */
  @Delete(':filename')
  @ApiParam({ name: 'filename', description: 'Nombre del archivo a eliminar' })
  @ApiResponse({ status: 200, description: 'Archivo eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado.' })
  async deleteFile(@Param('filename') filename: string) {
    const deleted = await this.filesService.deleteFile(filename);
    
    if (!deleted) {
      throw new NotFoundException('File not found');
    }

    return {
      success: true,
      message: 'File deleted successfully',
    };
  }
}
