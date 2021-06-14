// Dependencies
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class StorePlayerDTO {
  @IsNotEmpty({ message: 'Campo "phoneNumer" não deve ser vazio' })
  @IsString({ message: 'Campo "phoneNumer" deve ser do tipo String' })
  readonly phoneNumer: string

  @IsNotEmpty({ message: 'Campo "email" não deve ser vazio' })
  @IsString({ message: 'Campo "email" deve ser do tipo String' })
  @IsEmail({}, { message: 'Campo "email" deve conter um endereço valido' })
  readonly email: string

  @IsNotEmpty({ message: 'Campo "email" não deve ser vazio' })
  @IsString({ message: 'Campo "email" deve ser do tipo String' })
  readonly name: string
}