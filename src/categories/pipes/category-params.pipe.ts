// Dependencies
import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'

// Custom Pipe
export class CategoryParamsPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value) throw new BadRequestException(`O parâmetro ${metadata.data} deve ser preenchido.`)
    return value
  }
}