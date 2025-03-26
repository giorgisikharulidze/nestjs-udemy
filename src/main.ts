import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
 // await app.listen(process.env.PORT ?? 3000);

  try {
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Application successfully started on port ${process.env.PORT ?? 3000}`);
  } catch (error) {
    console.error(`Failed to start application on port ${process.env.PORT ?? 3000}. Error:`, error.message);
  }
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);  // თუ რამე შეცდომაა, აპლიკაცია დაიხურება
});
