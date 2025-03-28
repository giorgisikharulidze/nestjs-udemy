import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  // await app.listen(process.env.PORT ?? 3000);

  // Swagger კონფიგურაცია
  const config = new DocumentBuilder()
    .setTitle('NestJs')
//    .setDescription('Your API Description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      name: 'Authorization',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document,
    {
      swaggerOptions: {
        tagsSorter: 'alpha',  // 📌 API call-ები ალფავიტური რიგით დალაგდება
        operationsSorter: 'alpha'  // 📌 მეთოდები (GET, POST...) ალფავიტურად დალაგდება
      },}
  ); // 'api' არის URL, სადაც Swagger UI ხელმისაწვდომი იქნება

  try {
    await app.listen(process.env.PORT ?? 3000);
    console.log(
      `🚀🚀🚀 Application successfully started on port ${process.env.PORT ?? 3000} 🚀🚀🚀`,
    );
  } catch (error) {
    console.error(
      `Failed to start application on port ${process.env.PORT ?? 3000}. Error:`,
      error.message,
    );
  }
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1); // თუ რამე შეცდომაა, აპლიკაცია დაიხურება
});
