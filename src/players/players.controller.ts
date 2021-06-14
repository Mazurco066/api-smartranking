// Dependencies
import { Controller, Get, Delete, Post, Body, Put, Param } from '@nestjs/common'
import { StorePlayerDTO } from './dtos'
import { PlayerParamsPipe } from './pipes'
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
    @Param('id', PlayerParamsPipe) id: string,
    @Body() body: StorePlayerDTO
  ): Promise<Player> {
    return this.service.updatePlayer(body, id)
  }

  @Get('/:id')
  async findPlayer(@Param('id', PlayerParamsPipe) id: string): Promise<Player> {
    return this.service.findPlayer(id)
  }

  @Get()
  async findPlayers(): Promise<Player[] | Player> {
    return this.service.findPlayers()
  }

  @Delete('/:id')
  async deletePlayer(@Param('id', PlayerParamsPipe) id: string): Promise<void> {
    return this.service.deletePlayer(id)
  }
}
