import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
  controllers: [FilesController, ImagesController],
  providers: [FilesService, ImagesService],
  exports: [FilesService, ImagesService],
})
export class FilesModule {}
