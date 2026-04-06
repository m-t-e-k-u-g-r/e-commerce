import { OrderAddressDto } from './address.type';

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface OrderDto {
  id: number;
  userId: number;
  status: string;
  totalPrice: number;
  address: OrderAddressDto;
  items: OrderItem[];
}
