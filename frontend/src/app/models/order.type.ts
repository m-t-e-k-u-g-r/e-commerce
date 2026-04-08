import { OrderAddressDto } from './address.type';
import { Product } from './product.type';

export interface OrderItem {
  product: Product;
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
  createdDate: string;
}
