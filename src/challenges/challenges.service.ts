// Dependencies
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoError, ObjectId } from 'mongodb'
import { StoreChallengeDTO, UpdateChallengeDTO } from './dtos'
import { Challenge, ChallengeDocument, Match, MatchDocument } from './schemas'
import { PlayersService } from '../players/players.service'
import { CategoriesService } from '../categories/categories.service'
import { Category } from '../categories/schemas'

// Service 
@Injectable()
export class ChallengesService {

  // Dependency injection
  constructor(
    @InjectModel(Challenge.name) private challengeSchema: Model<ChallengeDocument>,
    @InjectModel(Match.name) private matchSchema: Model<MatchDocument>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService
  ) {}

  // Service logger
  private readonly logger = new Logger(PlayersService.name)

  // Public methods
  async storeChallenge(body: StoreChallengeDTO): Promise<Challenge> {
    this.logger.log(`storeChallenge - params: ${JSON.stringify(body)}`)

    // Destruct params
    const { players, requester } = body

    // Validate requester
    const requesterExists = await this.playersService.findPlayer(requester)
    if (!requesterExists) {
      throw new NotFoundException(`O Jogador com id ${requester} não existe!`)
    }

    // Validate if players exists
    for (const player in players) {
      const result = await this.playersService.findPlayer(players[player])
      if (!result) throw new NotFoundException(`O Jogador com id ${players[player]} não existe!`)
    }

    // Validate if requester is a challenger
    const isRequesterChallenger = players.filter(p => p === requester).length > 0
    if (!isRequesterChallenger) {
      throw new BadRequestException(`O desafiante de id ${requester} não está entre os jogadores da partida.`)
    }

    // Validate player category
    const playerCategory = await this.categoriesService.findPlayerCategory(requester)
    if (!playerCategory) {
      throw new BadRequestException('O solicitante precisa estar dentro de uma categoria para iniciar um desafio.')
    }

    // Creating challenge
    return await this.store(body, playerCategory)
  }

  async updateChallenge(body: UpdateChallengeDTO, id: string): Promise<Challenge> {
    this.logger.log(`updateChallenge - params: ${JSON.stringify(body)}`)

    // Validate challenge
    const hasChallenge = await this.findById(id)
    if (!hasChallenge) {
      throw new NotFoundException(`Desafio de id ${id} não encontrado!`)
    }

    // Updating schema
    return await this.update(body, id)
  }

  async findAllChallenges(id?: string): Promise<Challenge[]> {
    return id ? await this.findByPlayer(id) : await this.findAll()
  }

  // Persist methods
  async findById(id: string): Promise<Challenge> {
    return await this.challengeSchema.findOne({ _id: id })
      .populate('requester')
      .populate('match')
      .populate('players')
  }

  private async findAll(): Promise<Challenge[]> {
    return await this.challengeSchema.find()
      .populate('requester')
      .populate('match')
      .populate('players')
  }

  private async findByPlayer(id: string): Promise<Challenge[]> {
    return await this.challengeSchema.find({
      $or: [
        { players: { $in: [new ObjectId(id)] } },
        { requester: new ObjectId(id) }
      ]
    })
      .populate('requester')
      .populate('match')
      .populate('players')
  }

  private async store(data: StoreChallengeDTO, category: Category): Promise<Challenge> {
    try {

      const r = await this.challengeSchema.create({
        ...data,
        category: category._id,
        challengeRequestDateTime: new Date()
      })
      return r
      
    } catch(e) {
      throw new MongoError({ ...e })
    }
  }

  private async update(data: UpdateChallengeDTO, id: string): Promise<Challenge> {
    try {

      const params = {}
      const { challengeDateTime, status } = data

      if (challengeDateTime) params['challengeDateTime'] = new Date(challengeDateTime)
      if (status) {
        params['status'] = status
        params['challengeResponseDateTime'] = new Date()
      }

      const r = await this.challengeSchema.findOneAndUpdate({
        _id: id
      }, {
        $set: { ...params }
      }, {
        new: true
      })
      return r
      
    } catch(e) {
      throw new MongoError({ ...e })
    }
  }
}