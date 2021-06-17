// Dependencies
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'

// App init method
async function bootstrap() {
  // Express App
  const app = await NestFactory.create(AppModule)

  // DTO Configuration
  const validationOptions = {
    skipMissingProperties: false,
    validationError: { target: false },
    validateCustomDecorators: true
  }

  // Pipes, filters and prefixes
  app.useGlobalPipes(new ValidationPipe(validationOptions))

  // Start server
  await app.listen(3001)
}

// Starting app
bootstrap()
