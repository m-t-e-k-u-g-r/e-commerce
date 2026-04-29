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

export interface GuestOrderDto extends Omit<OrderDto, 'userId'> {}

export interface CreatedGuestOrderDto extends GuestOrderDto {
  guestId: number;
  accessToken: string;
}
