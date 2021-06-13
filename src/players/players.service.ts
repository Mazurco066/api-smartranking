// Dependencies
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoError } from 'mongodb'
import { DeletePlayerDTO, GetPlayerDTO, StorePlayerDTO, UpdatePlayerDTO } from './dtos'
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
  async storePlayer(body: StorePlayerDTO, params: UpdatePlayerDTO): Promise<Player> {
    this.logger.log(`storePlayer - params: ${JSON.stringify(body)}`)
    const player = this.store(body, params)
    return player
  }

  async findPlayers(params: GetPlayerDTO): Promise<Player[] | Player> {
    const { email } = params
    return email ? await this.findPlayer(params) : await this.listPlayers()
  }

  async deletePlayer(params: DeletePlayerDTO): Promise<void> {
    await this.delete(params)
  }

  // Persist methods
  private async store(data: StorePlayerDTO, params: UpdatePlayerDTO): Promise<Player> {
    try {

      const { email } = params

      const register = email ? await this.playerSchema.findOne({ email }) : null

      if (register) {

        const r = await this.playerSchema.findOneAndUpdate({ email }, {
          $set: { ...data }
        }, { new: true })
        return r

      } else {

        const r = await this.playerSchema.create({
          ...data,
          ranking: 'A',
          position: 5,
          avatar: 'https://ik.imagekit.io/vlu8c10nqkd/default-image.jpg'
        })
        return r

      }
      
    } catch(e) {
      throw new MongoError({ ...e })
    }
  }

  private async findPlayer(params: GetPlayerDTO): Promise<Player> {
    const { email } = params
    const r = await this.playerSchema.findOne({ email })
    if (!r) throw new NotFoundException('Player not found.')
    return r
  }

  private async listPlayers(): Promise<Player[]> {
    const r = await this.playerSchema.find()
    return r
  }

  private async delete(data: DeletePlayerDTO): Promise<boolean> {
    try {

      const { email } = data
      const foundPlayer = await this.playerSchema.findOne({ email })
      if (!foundPlayer) throw new NotFoundException('Player not found')
      const r = await this.playerSchema.deleteOne({ email })
      return r.deletedCount ? true : false

    } catch(e) {
      throw new MongoError({ ...e })
    }
  }
}
