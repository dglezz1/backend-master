
import { Module, forwardRef } from '@nestjs/common';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { PrismaService } from '../prisma.service';
import { AppModule } from '../app.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [forwardRef(() => AppModule), FilesModule],
  controllers: [QuotesController],
  providers: [QuotesService, PrismaService],
  exports: [QuotesService],
})
export class QuotesModule {}
