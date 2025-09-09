import { Injectable } from '@nestjs/common';
import { FilesService, FileUploadResult } from './files.service';

@Injectable()
export class ImagesService extends FilesService {
  private readonly allowedImageTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  /**
   * Valida si un archivo es una imagen válida
   */
  isValidImage(file: Express.Multer.File): boolean {
    return this.allowedImageTypes.includes(file.mimetype);
  }

  /**
   * Guarda una imagen validando el tipo
   */
  async saveImage(file: Express.Multer.File): Promise<FileUploadResult> {
    if (!this.isValidImage(file)) {
      throw new Error(`Invalid image type. Allowed types: ${this.allowedImageTypes.join(', ')}`);
    }

    return await this.saveFile(file);
  }

  /**
   * Guarda múltiples imágenes validando los tipos
   */
  async saveImages(files: Express.Multer.File[]): Promise<FileUploadResult[]> {
    // Validar que todos los archivos sean imágenes
    const invalidFiles = files.filter(file => !this.isValidImage(file));
    if (invalidFiles.length > 0) {
      throw new Error(`Invalid image files detected: ${invalidFiles.map(f => f.originalname).join(', ')}`);
    }

    return await this.saveFiles(files);
  }

  /**
   * Obtiene URLs de imágenes desde un string JSON
   */
  extractImageUrls(imageUrlsJson: string): string[] {
    try {
      const urls = JSON.parse(imageUrlsJson);
      return Array.isArray(urls) ? urls : [];
    } catch {
      return [];
    }
  }

  /**
   * Extrae nombres de archivo desde URLs
   */
  extractFilenamesFromUrls(imageUrls: string[]): string[] {
    return imageUrls
      .map(url => url.split('/').pop())
      .filter(filename => filename) as string[];
  }

  /**
   * Obtiene información de múltiples imágenes
   */
  async getImagesInfo(imageUrlsJson: string) {
    const urls = this.extractImageUrls(imageUrlsJson);
    const filenames = this.extractFilenamesFromUrls(urls);
    
    const imageInfos = await Promise.allSettled(
      filenames.map(filename => this.getFileInfo(filename))
    );

    return imageInfos
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value);
  }
}
