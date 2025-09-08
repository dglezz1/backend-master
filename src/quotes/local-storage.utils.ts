import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

/**
 * Guarda un archivo de forma local en la carpeta uploads
 * @param file Archivo Multer recibido en el endpoint
 * @returns Información del archivo guardado
 */
export async function saveFileLocally(file: Express.Multer.File): Promise<{
  filename: string;
  originalName: string;
  url: string;
  path: string;
}> {
  if (!file || !file.buffer) {
    throw new Error('Archivo inválido para guardar localmente.');
  }

  // Crear carpeta uploads si no existe
  const uploadsDir = path.join(process.cwd(), 'uploads');
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    // La carpeta ya existe, continuar
  }

  // Generar nombre único para el archivo
  const fileExtension = path.extname(file.originalname);
  const uniqueFilename = `${uuidv4()}${fileExtension}`;
  const filePath = path.join(uploadsDir, uniqueFilename);

  // Guardar archivo
  await writeFile(filePath, file.buffer);

  // Retornar información del archivo
  const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    filename: uniqueFilename,
    originalName: file.originalname,
    url: `${baseUrl}/uploads/${uniqueFilename}`,
    path: filePath
  };
}

/**
 * Elimina un archivo del almacenamiento local
 * @param filename Nombre del archivo a eliminar
 */
export async function deleteLocalFile(filename: string): Promise<void> {
  const filePath = path.join(process.cwd(), 'uploads', filename);
  
  try {
    await promisify(fs.unlink)(filePath);
  } catch (error) {
    console.warn(`No se pudo eliminar el archivo ${filename}:`, error.message);
  }
}

/**
 * Verifica si un archivo existe en el almacenamiento local
 * @param filename Nombre del archivo
 * @returns true si existe, false si no
 */
export function fileExists(filename: string): boolean {
  const filePath = path.join(process.cwd(), 'uploads', filename);
  return fs.existsSync(filePath);
}
