import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';

@Controller()
export class ViewController {
  /**
   * Sirve la vista de cotización dinámica
   */
  @Get('cotizacion/view/:id')
  async serveCotizacionView(@Param('id') id: string, @Res() res: Response) {
    const htmlPath = path.join(process.cwd(), 'public', 'cotizacion-view.html');
    res.sendFile(htmlPath);
  }
}
