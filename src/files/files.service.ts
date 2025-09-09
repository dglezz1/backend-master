import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export interface FileUploadResult {
  filename: string;
  url: string;
  path: string;
}

export interface FileInfo {
  originalName: string;
  filename: string;
  path: string;
  url: string;
  size: number;
  mimetype: string;
}

@Injectable()
export class FilesService {
  private readonly uploadsDir = join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadsDir();
  }

  /**
   * Asegura que el directorio de uploads existe
   */
  private async ensureUploadsDir(): Promise<void> {
    try {
      if (!existsSync(this.uploadsDir)) {
        await fs.mkdir(this.uploadsDir, { recursive: true });
      }
    } catch (error) {
      throw new InternalServerErrorException('Error creating uploads directory');
    }
  }

  /**
   * Guarda un archivo localmente
   */
  async saveFile(file: Express.Multer.File): Promise<FileUploadResult> {
    try {
      await this.ensureUploadsDir();
      
      const fileExtension = file.originalname.split('.').pop() || '';
      const filename = `${uuidv4()}.${fileExtension}`;
      const filepath = join(this.uploadsDir, filename);
      
      await fs.writeFile(filepath, file.buffer);
      
      return {
        filename,
        url: `/uploads/${filename}`,
        path: filepath,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error saving file');
    }
  }

  /**
   * Guarda múltiples archivos
   */
  async saveFiles(files: Express.Multer.File[]): Promise<FileUploadResult[]> {
    const results = await Promise.all(
      files.map((file) => this.saveFile(file))
    );
    return results;
  }

  /**
   * Obtiene información de un archivo
   */
  async getFileInfo(filename: string): Promise<FileInfo> {
    const filepath = join(this.uploadsDir, filename);
    
    if (!existsSync(filepath)) {
      throw new NotFoundException('File not found');
    }

    try {
      const stats = await fs.stat(filepath);
      
      return {
        originalName: filename,
        filename,
        path: filepath,
        url: `/uploads/${filename}`,
        size: stats.size,
        mimetype: this.getMimetypeFromExtension(filename),
      };
    } catch (error) {
      throw new InternalServerErrorException('Error reading file info');
    }
  }

  /**
   * Descarga un archivo
   */
  async downloadFile(filename: string): Promise<{ path: string; mimetype: string; originalName: string }> {
    const filepath = join(this.uploadsDir, filename);
    
    if (!existsSync(filepath)) {
      throw new NotFoundException('File not found');
    }

    return {
      path: filepath,
      mimetype: this.getMimetypeFromExtension(filename),
      originalName: filename,
    };
  }

  /**
   * Elimina un archivo
   */
  async deleteFile(filename: string): Promise<boolean> {
    try {
      const filepath = join(this.uploadsDir, filename);
      
      if (existsSync(filepath)) {
        await fs.unlink(filepath);
        return true;
      }
      
      return false;
    } catch (error) {
      throw new InternalServerErrorException('Error deleting file');
    }
  }

  /**
   * Elimina múltiples archivos
   */
  async deleteFiles(filenames: string[]): Promise<{ deleted: string[]; failed: string[] }> {
    const results = await Promise.allSettled(
      filenames.map(async (filename) => {
        const success = await this.deleteFile(filename);
        return { filename, success };
      })
    );

    const deleted: string[] = [];
    const failed: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        deleted.push(filenames[index]);
      } else {
        failed.push(filenames[index]);
      }
    });

    return { deleted, failed };
  }

  /**
   * Obtiene el mimetype basado en la extensión del archivo
   */
  private getMimetypeFromExtension(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    const mimetypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    return mimetypes[extension || ''] || 'application/octet-stream';
  }

  /**
   * Lista todos los archivos en el directorio de uploads
   */
  async listFiles(): Promise<FileInfo[]> {
    try {
      const files = await fs.readdir(this.uploadsDir);
      const fileInfos = await Promise.all(
        files.map((filename) => this.getFileInfo(filename))
      );
      return fileInfos;
    } catch (error) {
      throw new InternalServerErrorException('Error listing files');
    }
  }
}
