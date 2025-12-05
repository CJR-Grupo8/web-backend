import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// 1. Novos imports necessários para servir arquivos estáticos
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // 2. Adicionamos o tipo <NestExpressApplication> aqui
  // Isso diz ao TypeScript que estamos usando Express e libera o método useStaticAssets
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3. --- CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS ---
  // Isso "libera" a pasta 'uploads' para ser acessada publicamente.
  // Ex: Se o arquivo está em 'uploads/avatars/foto.jpg',
  // ele será acessível em 'http://localhost:3001/uploads/avatars/foto.jpg'
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  // --------------------------------------------
  
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3001}`);
}
bootstrap();