// Dependencies
import { Controller, Get, Delete, Post, Body, Query } from '@nestjs/common'
import { DeletePlayerDTO, GetPlayerDTO, StorePlayerDTO, UpdatePlayerDTO } from './dtos'
import { Player } from './schemas'
import { PlayersService } from './players.service'

// Controller
@Controller('api/v1/players')
export class PlayersController {

  // Dependency injection
  constructor(private readonly service: PlayersService) {}

  // Endpoints
  @Post()
  async storePlayer(
    @Query() params: UpdatePlayerDTO,
    @Body() body: StorePlayerDTO
  ): Promise<Player> {
    return this.service.storePlayer(body, params)
  }

  @Get()
  async findPlayers(@Query() params: GetPlayerDTO): Promise<Player[] | Player> {
    return this.service.findPlayers(params)
  }

  @Delete()
  async deletePlayer(@Query() params: DeletePlayerDTO): Promise<void> {
    return this.service.deletePlayer(params)
  }
}
