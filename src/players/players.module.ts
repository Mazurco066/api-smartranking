// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// Providers
import { PlayersController } from './players.controller'
import { PlayersService } from './players.service'

// Schemas
import { Player, PlayerSchema } from './schemas'

// Module
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema }
    ])
  ],
  controllers: [PlayersController],
  providers: [PlayersService]
})
export class PlayersModule {}
