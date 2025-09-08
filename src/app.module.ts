import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuotesModule } from './quotes/quotes.module';
import { FilesModule } from './files/files.module';
import { PrismaService } from './prisma.service';
import { ViewController } from './view.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    QuotesModule,
    FilesModule
  ],
  controllers: [AppController, ViewController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
