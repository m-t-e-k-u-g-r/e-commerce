import { inject, Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cartItem.type';
import { environment } from '../../environments/environment.development';
import { ProductService } from './product.service';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  baseUrl = environment.apiUrl + 'cart';
  http = inject(HttpClient);
  productService = inject(ProductService);
  authService = inject(AuthService);
  private _cart = signal<CartItem[]>([]);
  readonly cart = this._cart.asReadonly();
  readonly totalItems = computed(() =>
    this.cart().reduce((total, item) => total + item.quantity, 0),
  );
  readonly totalAmount = computed(() =>
    Math.round(
      this.cart().reduce((total, item) => {
        const product = this.productService.products().find((p) => p.id === item.productId);
        const price = product?.price ?? 0;
        return total + item.quantity * price;
      }, 0) * 100
    ) / 100
  );

  getCartItems() {
    if (this.authService.isLoggedIn()) {
      return this.http.get<CartItem[]>(this.baseUrl + '/items',
        { withCredentials: true }
      ).subscribe((items: CartItem[]) => {
          this._cart.set(items);
        });
    } else {
      const cart = localStorage.getItem('cart');
      if (cart) {
        this._cart.set(JSON.parse(cart));
      }
      return;
    }
  }

  addItem(productId: number) {
    if (this.authService.isLoggedIn()) {
      return this.http.post(this.baseUrl + '/items/' + productId, {},
        { withCredentials: true }
      ).subscribe(() => this.getCartItems());
    } else {
      this._cart.update((items) => {
        const index = items.findIndex((i) => i.productId === productId);
        if (index !== -1) {
          return items.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i));
        }
        return [...items, { productId: productId, quantity: 1 }];
      });
      this.saveToLocalStorage();
    }
    return;
  }

  reduceQuantity(productId: number) {
    if (this.authService.isLoggedIn()) {
      const item = this.cart().find((i) => i.productId === productId);
      if (item) {
        const newQuantity = item.quantity - 1;
        if (newQuantity > 0) {
          return this.http.put(this.baseUrl + '/items/' + item.id, { quantity: newQuantity },
            { withCredentials: true }
          ).subscribe(() => {
            this.getCartItems();
          });
        } else {
          this.removeItem(productId);
          this.getCartItems();
        }
      }
    } else {
      this._cart.update((items) => {
        const index = items.findIndex((i) => i.productId === productId);
        if (index === -1) return items;

        if (items[index].quantity === 1) {
          return items.filter((item) => item.productId !== productId);
        } else {
          return items.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i));
        }
      });
      this.saveToLocalStorage();
    }
    return;
  }

  removeItem(productId: number) {
    if (this.authService.isLoggedIn()) {
      const item = this.cart().find((i) => i.productId === productId);
      if (item) {
        return this.http.delete(this.baseUrl + '/items/' + item.id,
          { withCredentials: true }
        ).subscribe(() => this.getCartItems());
      }
    } else {
      this._cart.update((items) => items.filter((item) => item.productId !== productId));
      this.saveToLocalStorage();
    }
    return;
  }

  clearCart() {
    if (this.authService.isLoggedIn()) {
      this.http.delete(this.baseUrl,
        { withCredentials: true }
      ).subscribe();
      this.getCartItems();
    } else {
      this._cart.set([]);
      this.saveToLocalStorage();
    }
    return;
  }

  private saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }
}
