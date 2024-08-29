import { Schema, model } from 'mongoose';
import { Store } from '../entities/store.entity';

export const StoreSchema = new Schema<Store>({
  name: { type: String },
  mcode: { type: String,required: true },
  saasapi: {type: String},
  status: { type: Number },
  dbname: { type: String },
  api_list: [{type: String}]
},{timestamps: true});

export const StoreModel = model<Store>('Store', StoreSchema);

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument } from 'mongoose';

// export type StoreDocument = HydratedDocument<Storedb>;
// @Schema()
// export class Storedb {
//   @Prop()
//   name:string

//   @Prop({required:true})
//   mcode:string

//   @Prop()
//   saasapi: string

//   @Prop()
//   status: number

//   @Prop()
//   dbname: string

//   @Prop()
//   api_list: string[]
// }

// export const StoreSchema = SchemaFactory.createForClass(Storedb);