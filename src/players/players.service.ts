// Dependencies
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { v4 } from 'uuid'
import { DeletePlayerDTO, GetPlayerDTO, StorePlayerDTO } from './dtos'
import { Player } from './interfaces'

// Service 
@Injectable()
export class PlayersService {

  private players: Player[] = []

  // Service logger
  private readonly logger = new Logger(PlayersService.name)

  // Public methods
  async storePlayer(params: StorePlayerDTO): Promise<Player> {
    this.logger.log(`storePlayer - params: ${JSON.stringify(params)}`)
    const player = this.store(params)
    return player
  }

  async findPlayers(params: GetPlayerDTO): Promise<Player[] | Player> {
    const { email } = params
    if (email && !this.players.find(({ email: _email }) => _email === email))
      throw new NotFoundException('Player not found.')
    return email ? this.players.find(({ email: _email }) => _email === email) : this.players
  }

  async deletePlayer(params: DeletePlayerDTO): Promise<void> {
    this.delete(params)
  }

  // Persist methods
  private store(data: StorePlayerDTO): Player {
    const { name, phoneNumer, email } = data
    const player: Player = {
      _id: v4(),
      name,
      phoneNumer,
      email,
      ranking: 'A',
      position: 5,
      avatar: ''
    }
    this.players.push(player)
    return player
  }

  private delete(data: DeletePlayerDTO): void {
    const { email } = data
    const foundPlayer = this.players.find(({ email: _email }) => _email === email)
    if (!foundPlayer) throw new NotFoundException('Player not found')
    this.players = this.players.filter(({ email: _email }) => _email !== email)
  }
}
