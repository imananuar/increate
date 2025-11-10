import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AIModule } from './ai/ai.module';
import { InvoiceModule } from './invoice/invoice.module';
import { UserModule } from './user/user.module';
import { FfmpegService } from './ffmpeg/ffmpeg.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, AuthModule, AIModule, InvoiceModule, UserModule, HttpModule],
  controllers: [AppController],
  providers: [AppService, FfmpegService],
})
export class AppModule {}
