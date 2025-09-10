import { IsString, IsOptional, IsInt, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para crear una cotización de pastel
 */
export class CreateQuoteDto {
  @ApiProperty({ description: 'Nombre del cliente' })
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Teléfono del cliente' })
  @IsString()
  customerPhone: string;

  @ApiPropertyOptional({ description: 'Email del cliente' })
  @IsOptional()
  @IsString()
  customerEmail?: string;

  @ApiProperty({ description: 'Número de invitados' })
  @IsInt()
  guests: number;

  @ApiProperty({ description: 'Tipo de pastel' })
  @IsString()
  cakeType: string;

  @ApiProperty({ description: 'Tipo de entrega' })
  @IsString()
  delivery: string;

  @ApiProperty({ description: 'Fecha de entrega' })
  @IsDateString()
  deliveryDate: string;

  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Acepta términos y condiciones' })
  @IsBoolean()
  agreement: boolean;

  @ApiPropertyOptional({ description: 'Tiene alergias' })
  @IsOptional()
  @IsBoolean()
  allergies?: boolean;
}
