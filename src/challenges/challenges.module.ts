// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Challenge, ChallengeSchema, Match, MatchSchema } from './schemas'
import { ChallengesController } from './challenges.controller'
import { ChallengesService } from './challenges.service'

// Modules
import { PlayersModule } from '../players/players.module'
import { CategoriesModule } from '../categories/categories.module'

// Module
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
      { name: Match.name, schema: MatchSchema }
    ]),
    PlayersModule,
    CategoriesModule
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService]
})
export class ChallengesModule {}