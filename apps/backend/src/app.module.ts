import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AIModule } from './ai/ai.module';
import { InvoiceModule } from './invoice/invoice.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DatabaseModule, AuthModule, AIModule, InvoiceModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
