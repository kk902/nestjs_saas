import { Schema, model } from 'mongoose';
import { Permiss } from '../entities/permiss.entity';

export const PermissSchema = new Schema<Permiss>({
  saas_name: { type: String },
  mcode: {type: String},
  appId: { type: String },
  api_list: [{type: String}]
},{timestamps: true});

export const PermissModel = model<Permiss>('Permiss', PermissSchema);