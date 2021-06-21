// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { config } from 'dotenv'
import { databaseURI } from './common/config'

// Modules
import { PlayersModule } from './players/players.module'
import { CategoriesModule } from './categories/categories.module'
import { ChallengesModule } from './challenges/challenges.module'

// Init end variables
config()

@Module({
  imports: [
    MongooseModule.forRoot(databaseURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      dbName: process.env.MONGODB_DATABASE
    }),
    PlayersModule,
    CategoriesModule,
    ChallengesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
