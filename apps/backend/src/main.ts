import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
      logger: new ConsoleLogger({
      prefix: 'Increate', // Default is "Nest"
    }),
  });
  const configService = app.get(ConfigService);
  // Enable CORS for frontend
  app.enableCors({
    origin: configService.get<string>('FRONTEND') || 'http://localhost:4200',
    credentials: true,
  });
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();
