import { GuestOrderDto, OrderDto } from '../models/order.type';

export function isUserOrder(order: OrderDto | GuestOrderDto): boolean {
  return 'userId' in order;
}
