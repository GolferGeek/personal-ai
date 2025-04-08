import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002', // Added for when Next.js fallbacks to 3002
      'http://localhost:3003',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Enable global validation pipes with more lenient settings
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,         // Strip properties not in DTOs
    forbidNonWhitelisted: false, // Don't throw error for extra properties
    transform: true,         // Automatically transform payloads to DTO instances
    transformOptions: {
      enableImplicitConversion: true, // Allow basic type conversions
    },
    validateCustomDecorators: true,
    skipMissingProperties: true,      // Skip validation for missing properties
  }));

  // Try to start on port 3001, but fall back to other ports if needed
  const tryPorts = [3001, 3003, 3004, 3005];
  
  for (const port of tryPorts) {
    try {
      await app.listen(port);
      logger.log(`Application started successfully on port ${port}`);
      break; // Exit the loop if successful
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        logger.warn(`Port ${port} is in use, trying next port...`);
        // Continue to next port
      } else {
        // For other errors, rethrow
        throw error;
      }
    }
  }
}
bootstrap();
