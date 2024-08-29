import { Schema, Document } from 'mongoose';
import { Prop, Schema as MongooseSchema, SchemaFactory } from '@nestjs/mongoose';
import { orderStatus } from '../entities/order.entity';

@MongooseSchema()
export class Order extends Document {
  @Prop({ type: String })
  user_id: string;

  @Prop({ type: String })
  saas_name: string;

  @Prop({ type: String })
  phone_number: string;

  @Prop({ type: String })
  appId: string;
  
  @Prop({ type: String })
  amount: string;

  @Prop({ type: String })
  order_type: string;

  @Prop({ type: String })
  order_status: orderStatus;

  @Prop({ type: String })
  balance: string;

  @Prop({ type: Object })
  data: Record<string, any>; // 使用 Record<string, any> 来表示任意对象
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.set('timestamps', true);
