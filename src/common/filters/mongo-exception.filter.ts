// Dependencies
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { MongoError } from 'mongodb'
import { baseResponse } from '../helpers'

// Error Filter
@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()
    const response = ctx.getResponse()
    
    // Mongo errors mapping
    switch (exception.code) {
      // Unique value errors
      case 11000:
        const [key, value] = Object.entries({ ...exception }?.['keyValue'])?.[0]
        response.status(400).json(baseResponse(
          400,
          (key && value) ? `${key} ${value} já esta em uso!` : 'Chave única já esta em uso!',
          {
            timestamp: new Date().toISOString(),
            path: request.url
          }
        ))
        break
    }
  }
}