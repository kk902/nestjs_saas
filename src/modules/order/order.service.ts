import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  

  findAll() {
    return `This action returns all order`;
  }

  
}
