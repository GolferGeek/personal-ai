import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (configure origins more strictly for production)
  app.enableCors({
    origin: '*', // Allow requests from anywhere for now
  });

  // Enable global validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties not in DTOs
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    transform: true, // Automatically transform payloads to DTO instances
    transformOptions: {
        enableImplicitConversion: true, // Allow basic type conversions (e.g., string to number for path params)
    },
  }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`NestJS application is running on: ${await app.getUrl()}`);
}
bootstrap();
