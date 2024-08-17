import { Schema, model } from 'mongoose';
import { Store } from '../entities/store.entity';

export const StoreSchema = new Schema<Store>({
  name: { type: String },
  mcode: { type: String,required: true },
  saasapi: {type: String},
  status: { type: Number },
  dbname: { type: String },
  api_list: [{type: String}]
});

export const StoreModel = model<Store>('Store', StoreSchema);