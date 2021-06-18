// Dependencies
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter, MongoExceptionFilter } from './common/filters'

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
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new MongoExceptionFilter()
  )

  // Start server
  await app.listen(3001)
}

// Starting app
bootstrap()
