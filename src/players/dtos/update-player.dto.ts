// Dependencies
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdatePlayerDTO {
  @IsNotEmpty({ message: 'Campo "phoneNumer" não deve ser vazio' })
  @IsString({ message: 'Campo "phoneNumer" deve ser do tipo String' })
  readonly phoneNumber: string

  @IsNotEmpty({ message: 'Campo "email" não deve ser vazio' })
  @IsString({ message: 'Campo "email" deve ser do tipo String' })
  readonly name: string
}