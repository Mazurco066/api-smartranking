// Dependencies
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MongoError, ObjectId } from 'mongodb'
import { Category, CategoryDocument } from './schemas'
import { StoreCategoryDTO, UpdateCategoryDTO } from './dtos'
import { PlayersService } from '../players/players.service'

// Service
@Injectable()
export class CategoriesService {

  // Dependency injection
  constructor(
    @InjectModel(Category.name) private categorySchema: Model<CategoryDocument>,
    private readonly playersService: PlayersService
  ) {}

  // Service logger
  private readonly logger = new Logger(CategoriesService.name)

  // Public methods
  async storeCategory(body: StoreCategoryDTO): Promise<Category> {
    this.logger.log(`storeCategory - params: ${JSON.stringify(body)}`)

    const isRegistered = await this.findByTitle(body.title)
    if (isRegistered) {
      throw new BadRequestException(`Categoria ${body.title} já cadastrada!`)
    }

    return await this.store(body)
  }

  async updateCategory(body: UpdateCategoryDTO, id: string): Promise<Category> {
    this.logger.log(`updateCategory - params: ${JSON.stringify(body)}`)

    const isRegistered = await this.findById(id)
    if (!isRegistered) {
      throw new NotFoundException(`Categoria ${id} não encontrada!`)
    }

    return await this.update(body, id)
  }

  async findCategories(): Promise<Category[]> {
    return await this.list()
  }

  async findCategory(id: string): Promise<Category> {
    const foundCategory = await this.findById(id)
    if (!foundCategory) {
      throw new NotFoundException(`Categoria de id ${id} não encontrada!`)
    }

    return foundCategory
  }

  async deleteCategory(id: string): Promise<void> {
    const foundCategory = await this.findById(id)
    if (!foundCategory) {
      throw new NotFoundException(`Categoria de id ${id} não encontrada!`)
    }

    await this.delete(id)
  }

  async assignPlayer(params: string[]): Promise<Category> {
    this.logger.log(`assignPlayer - params: ${JSON.stringify(params)}`)

    const isRegistered = await this.findById(params['id'])
    if (!isRegistered) {
      throw new NotFoundException(`Categoria ${params['id']} não encontrada!`)
    }

    const isPlayerRegistered = await this.playersService.findPlayer(params['playerId'])
    if (!isPlayerRegistered) {
      throw new NotFoundException(`Jogador de id ${params['playerId']} não encontrado!`)
    }

    if (isRegistered.players.find(p => p['_id'] === params['playerId'])) {
      throw new BadRequestException(`Jogador de id ${params['playerId']} já está incluso nessa categoria!`)
    }

    isRegistered.players.push(new ObjectId(params['playerId']))

    return await this.assign(isRegistered)
  }

  // Persist methods
  async findById(id: string): Promise<Category> {
    return await this.categorySchema.findOne({ _id: id }).populate('players')
  }

  async findByTitle(title: string): Promise<Category> {
    return await this.categorySchema.findOne({ title }) 
  }

  private async store(data: StoreCategoryDTO): Promise<Category> {
    try {

      const r = await this.categorySchema.create({ ...data })
      return r
      
    } catch(e) {
      throw new MongoError({ ...e })
    }
  }

  private async update(data: UpdateCategoryDTO, id: string): Promise<Category> {
    try {

      const r = await this.categorySchema.findByIdAndUpdate(id, {
        $set: {
          ...data
        }
      }, { new: true })
      return r
      
    } catch(e) {
      throw new MongoError({ ...e })
    }
  }

  private async list(): Promise<Category[]> {
    const r = await this.categorySchema.find().populate('players')
    return r
  }

  private async delete(id: string): Promise<boolean> {
    try {
      const r = await this.categorySchema.deleteOne({ _id: id })
      return r.deletedCount ? true : false

    } catch(e) {
      throw new MongoError({ ...e })
    }
  }

  private async assign(category: Category): Promise<Category> {
    try {

      return await this.categorySchema.findOneAndUpdate({
        _id: category._id
      }, {
        $set: category
      }, {
        new: true
      }).populate('players')

    } catch(e) {
      console.log(e)
      throw new MongoError({ ...e })
    }
  }
}
