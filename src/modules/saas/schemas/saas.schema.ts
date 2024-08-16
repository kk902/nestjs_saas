import { Schema, model } from 'mongoose';
import { Saas } from '../entities/saa.entity';
import { UserRole } from 'src/modules/user/entities/user.entity';

export const SaasSchema = new Schema<Saas>({
  saas_name: { type: String },
  role: {type: String,enum: UserRole},
  phone_number: { type: String },
  appId: { type: String },
  key: { type: String },
  mcode: { type: String },
  data: { type: Object },
});

export const UserModel = model<Saas>('Saas', SaasSchema);