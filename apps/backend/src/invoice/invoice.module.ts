import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIModule } from 'src/ai/ai.module';
import { Item } from './entities/item.entity';
import { Invoice } from './entities/invoice.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, Invoice, User]),
    AIModule
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, UserService],
  exports: [InvoiceService]
})
export class InvoiceModule {}
