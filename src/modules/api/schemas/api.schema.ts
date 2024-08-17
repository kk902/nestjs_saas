import { Schema, model } from 'mongoose';
import { Api } from '../entities/api.entity';

export const ApiSchema = new Schema<Api>({
  saas_api: {type: String,require: true},
  describe: {type: String,require: true},
  status: {type: Boolean,default: true}
});

export const ApiModel = model<Api>('Api', ApiSchema);