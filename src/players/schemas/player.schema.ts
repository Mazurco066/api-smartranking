// Dependencies
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { v4 } from 'uuid'

// Model
@Schema({ timestamps: true, collection: 'Players'})
export class Player {
  @Prop({ type: String, default: () => v4(), required: false })
  _id: string

  @Prop({ required: true })
  phoneNumber: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true, type: String })
  name: string

  @Prop({ required: true })
  ranking: string

  @Prop({ required: true })
  position: number

  @Prop({ required: false, default: '' })
  avatar: string
}

// Model + Document
export type PlayerDocument = Player & Document

// Schema
export const PlayerSchema = SchemaFactory.createForClass(Player)