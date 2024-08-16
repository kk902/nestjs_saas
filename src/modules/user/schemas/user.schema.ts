import { Schema, model } from 'mongoose';
import { User } from '../entities/user.entity';
import { UserRole } from '../dto/create-user.dto';

export const UserSchema = new Schema<User>({
  saas_name: { type: String },
  role: {type: String,enum: UserRole},
  phone_number: { type: String },
  password: { type: String },
  balance: {type: String, default: "0"},
  appId: { type: String },
  key: { type: String },
  white_list: [{ type: String}],
  store_list: [{ type: String}],
});

export const UserModel = model<User>('User', UserSchema);