// Dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { config } from 'dotenv'
import { databaseURI } from './common'

// Modules
import { PlayersModule } from './players/players.module'

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
    PlayersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
