import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/auth/entities/user.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { Item } from 'src/invoice/entities/item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Invoice, Item],
        synchronize: configService.get('NODE_ENV') === 'staging',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
