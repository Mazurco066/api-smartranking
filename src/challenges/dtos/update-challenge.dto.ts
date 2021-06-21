// Dependencies
import { IsOptional, IsNotEmpty, IsString, IsDateString } from 'class-validator'

// DTO
export class UpdateChallengeDTO {
  @IsOptional()
  @IsDateString({}, { message: 'Campo "challengeDateTime" deve ser do tipo Data' })
  readonly challengeDateTime: string

  @IsNotEmpty({ message: 'Campo "status" não deve ser vazio' })
  @IsString({ message: 'Campo "status" deve ser do tipo String' })
  readonly status: string
}