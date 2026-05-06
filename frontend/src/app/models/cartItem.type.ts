import { Product } from './product.type';

export interface CartItem {
  id?: number;
  productId: number;
  quantity: number;
}

export interface computedCartItem extends CartItem {
  productInfo: Product | undefined;
}
