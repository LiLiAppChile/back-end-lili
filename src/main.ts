import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger/swagger.config';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Swagger
  setupSwagger(app);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
