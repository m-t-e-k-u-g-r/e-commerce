import { inject, Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cartItem.type';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  productService = inject(ProductService);
  private _cart = signal<CartItem[]>([]);
  readonly cart = this._cart.asReadonly();
  readonly totalItems = computed(() =>
    this.cart().reduce((total, item) => total + item.quantity, 0),
  );
  readonly totalAmount = computed(() =>
    this.cart().reduce((total, item) => {
      const product = this.productService.products().find((p) => p.id === item.productId);
      const price = product?.price ?? 0;
      return total + item.quantity * price;
    }, 0),
  );

  addItem(id: number) {
    this._cart.update((items) => {
      const index = items.findIndex((i) => i.productId === id);
      if (index !== -1) {
        return items.map((i) => (i.productId === id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...items, { productId: id, quantity: 1 }];
    });
    this.saveToLocalStorage();
  }

  reduceQuantity(id: number) {
    this._cart.update((items) => {
      const index = items.findIndex((i) => i.productId === id);
      if (index === -1) return items;

      if (items[index].quantity === 1) {
        return items.filter((item) => item.productId !== id);
      } else {
        return items.map((i) => (i.productId === id ? { ...i, quantity: i.quantity - 1 } : i));
      }
    });
    this.saveToLocalStorage();
  }

  removeItem(id: number) {
    this._cart.update((items) => items.filter((item) => item.productId !== id));
    this.saveToLocalStorage();
  }

  clearCart() {
    this._cart.set([]);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }

  loadFromLocalStorage() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this._cart.set(JSON.parse(cart));
    }
  }
}
