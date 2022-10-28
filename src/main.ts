import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
  .setTitle('Whatsapp RESTFul API')
  .setDescription('Esta API tiene como propósito enviar notificaciones y confirmación de reserva via whatsapp a los clientes del sistema Planner')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // app.enableCors({
  //   origin: [
  //     'http://localhost:4200',
  //   ],
  //   methods: ["GET", "POST"],
  //   credentials: true,
  // });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
