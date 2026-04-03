import { Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cartItem.type';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cart = signal<CartItem[]>([]);
  readonly cart = this._cart.asReadonly();
  readonly totalItems = this.cart().reduce((total, item) => total + item.quantity, 0);

  addItem(id: number) {
    const item = this.cart().find(item => item.productId === id);
    if (item) {
      item.quantity++;
    } else {
      this._cart.update(items => [...items, { productId: id, quantity: 1 }]);
    }
    this.saveToLocalStorage();
  }

  editQuantity(id: number, quantity: number) {
    if (quantity == 0) return;
    this._cart.update(items => items.map(item => item.productId === id ? { ...item, quantity } : item));
  }

  removeItem(id: number) {
    this._cart.update(items => items.filter(item => item.productId !== id));
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
