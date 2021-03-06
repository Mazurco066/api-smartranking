// Dependencies
import { Controller, Get, Delete, Post, Body, Put, Param } from '@nestjs/common'
import { StorePlayerDTO, UpdatePlayerDTO } from './dtos'
import { ValidateParamsPipe } from '../common/pipes'
import { Player } from './schemas'
import { PlayersService } from './players.service'

// Controller
@Controller('api/v1/players')
export class PlayersController {

  // Dependency injection
  constructor(private readonly service: PlayersService) {}

  // Endpoints
  @Post()
  async storePlayer(@Body() body: StorePlayerDTO): Promise<Player> {
    return this.service.storePlayer(body)
  }

  @Put('/:id')
  async updatePlayer(
    @Param('id', ValidateParamsPipe) id: string,
    @Body() body: UpdatePlayerDTO
  ): Promise<Player> {
    return this.service.updatePlayer(body, id)
  }

  @Get('/:id')
  async findPlayer(@Param('id', ValidateParamsPipe) id: string): Promise<Player> {
    return this.service.findPlayer(id)
  }

  @Get()
  async findPlayers(): Promise<Player[]> {
    return this.service.findPlayers()
  }

  @Delete('/:id')
  async deletePlayer(@Param('id', ValidateParamsPipe) id: string): Promise<void> {
    return this.service.deletePlayer(id)
  }
}
