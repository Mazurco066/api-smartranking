// Dependencies
import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CategoryParamsPipe } from './pipes'
import { StoreCategoryDTO, UpdateCategoryDTO } from './dtos'
import { Category } from './schemas'

// Controller
@Controller('api/v1/categories')
export class CategoriesController {

  // Dependency injection
  constructor(private readonly service: CategoriesService) {}

  // Endpoints
  @Post()
  async storeCategory(@Body() body: StoreCategoryDTO): Promise<Category> {
    return this.service.storeCategory(body)
  }

  @Put('/:id')
  async updateCategory(
    @Param('id', CategoryParamsPipe) id: string,
    @Body() body: UpdateCategoryDTO
  ): Promise<Category> {
    return this.service.updateCategory(body, id)
  }

  @Get('/:id')
  async findCategory(@Param('id', CategoryParamsPipe) id: string): Promise<Category> {
    return this.service.findCategory(id)
  }

  @Get()
  async findCategories(): Promise<Category[]> {
    return this.service.findCategories()
  }

  @Delete('/:id')
  async deleteCategory(@Param('id', CategoryParamsPipe) id: string): Promise<void> {
    return this.service.deleteCategory(id)
  }

  @Post('/:id/players/:playerId')
  async assignPlayer(
    @Param() params: string[]
  ): Promise<Category> {
    return this.service.assignPlayer(params)
  }
}
