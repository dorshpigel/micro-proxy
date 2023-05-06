import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const port = 3100;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  logger.log(`Application running on port ${port}`,'Application');
  await app.listen(3100);
}
bootstrap();
