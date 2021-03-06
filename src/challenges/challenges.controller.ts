// Dependencies
import { Controller, Post, Get, Put, Delete, Param, Query, Body } from '@nestjs/common'
import { ChallengesService } from './challenges.service'
import { ValidateParamsPipe } from '../common/pipes'
import { AssignChallengeDTO, StoreChallengeDTO, UpdateChallengeDTO } from './dtos'
import { Challenge } from './schemas'

// Controller
@Controller('api/v1/challenges')
export class ChallengesController {

  // Dependency injection
  constructor(private readonly service: ChallengesService) {}

  // Endpoints
  @Post()
  async storeCategory(@Body() body: StoreChallengeDTO): Promise<Challenge> {
    return this.service.storeChallenge(body)
  }

  @Put('/:id')
  async updateChallenge(
    @Param('id', ValidateParamsPipe) id: string,
    @Body() body: UpdateChallengeDTO
  ): Promise<Challenge> {
    return this.service.updateChallenge(body, id)
  }

  @Post('/:id/match')
   async atribuirDesafioPartida(
    @Body() body: AssignChallengeDTO,
    @Param('id') id: string
  ): Promise<Challenge> {
    return await this.service.assignChallengeMatch(body, id)           
  }

  @Get('/:id')
  async findChallenge(@Param('id', ValidateParamsPipe) id: string): Promise<Challenge> {
    return this.service.findChallenge(id)
  }

  @Get()
  async getChallenges(@Query('playerId') id: string) : Promise<Challenge[]> {
    return await this.service.findAllChallenges(id)
  }

  @Delete('/:id')
  async deleteCategory(@Param('id', ValidateParamsPipe) id: string): Promise<void> {
    return this.service.deleteChallenge(id)
  }
}
