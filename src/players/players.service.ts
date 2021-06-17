// Dependencies
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoError } from 'mongodb'
import { StorePlayerDTO, UpdatePlayerDTO } from './dtos'
import { Player, PlayerDocument } from './schemas'

// Service 
@Injectable()
export class PlayersService {

  // Dependency injection
  constructor(
    @InjectModel(Player.name) private playerSchema: Model<PlayerDocument>
  ) {}

  // Service logger
  private readonly logger = new Logger(PlayersService.name)

  // Public methods
  async storePlayer(body: StorePlayerDTO): Promise<Player> {
    this.logger.log(`storePlayer - params: ${JSON.stringify(body)}`)
    const player = await this.store(body)
    return player
  }

  async updatePlayer(body: UpdatePlayerDTO, id: string): Promise<Player> {
    this.logger.log(`updatePlayer - params: ${JSON.stringify(body)}`)
    const player = await this.update(body, id)
    return player
  }

  async findPlayer(id: string): Promise<Player> {
    const player = await this.searchPlayer(id)
    if (!player) {
      throw new NotFoundException(`Jogador de id ${id} não encontrado!`)
    }

    return player
  }

  async findPlayers(): Promise<Player[]> {
    return await this.listPlayers()
  }

  async deletePlayer(id: string): Promise<void> {
    await this.delete(id)
  }

  // Persist methods
  private async store(data: StorePlayerDTO): Promise<Player> {
    try {

      const r = await this.playerSchema.create({
        ...data,
        ranking: 'A',
        position: 5,
        avatar: 'https://ik.imagekit.io/vlu8c10nqkd/default-image.jpg'
      })
      return r
      
    } catch(e) {
      throw new MongoError({ ...e })
    }
  }

  private async update(data: UpdatePlayerDTO, id: string): Promise<Player> {
    try {

      const r = await this.playerSchema.findByIdAndUpdate(id, {
        $set: {
          ...data
        }
      }, { new: true })
      return r
      
    } catch(e) {
      throw new MongoError({ ...e })
    }
  }

  private async searchPlayer(id: string): Promise<Player> {
    return await this.playerSchema.findOne({ _id: id })
  }

  private async listPlayers(): Promise<Player[]> {
    const r = await this.playerSchema.find()
    return r
  }

  private async delete(id: string): Promise<boolean> {
    try {
      const foundPlayer = await this.playerSchema.findOne({ _id:  id })
      if (!foundPlayer) throw new NotFoundException('Player not found')
      const r = await this.playerSchema.deleteOne({ _id: id })
      return r.deletedCount ? true : false

    } catch(e) {
      throw new MongoError({ ...e })
    }
  }
}
