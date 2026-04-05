import { inject, Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cartItem.type';
import { environment } from '../../environments/environment.development';
import { ProductService } from './product.service';
import { AuthService } from './auth.service';
import { Httpclient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  baseUrl = environment.apiUrl + '/cart';
  http = inject(HttpClient);
  productService = inject(ProductService);
  authService = inject(AuthService);
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

  getCartItems() {
    if (this.authService.isLoggedIn) {
      // TODO: Fetch from API if logged in (GET /cart/items), else use local storage
    } else {
      const cart = localStorage.getItem('cart');
      if (cart) {
        this._cart.set(JSON.parse(cart));
      }
    }
  }

  addItem(id: number) {
    if (this.authService.isLoggedIn) {
      // TODO: Implement API call to add item to database (POST /cart/items)
    } else {
      this._cart.update((items) => {
        const index = items.findIndex((i) => i.productId === id);
        if (index !== -1) {
          return items.map((i) => (i.productId === id ? { ...i, quantity: i.quantity + 1 } : i));
        }
        return [...items, { productId: id, quantity: 1 }];
      });
      this.saveToLocalStorage();
    }
  }

  reduceQuantity(id: number) {
    if (this.authService.isLoggedIn) {
      // TODO: Implement API call to update quantity in database (PUT /cart/items/{id})
    } else {
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
  }

  removeItem(id: number) {
    if (this.authService.isLoggedIn) {
      // TODO: Implement API call to remove item from database (DELETE /cart/items/{id})
    } else {
      this._cart.update((items) => items.filter((item) => item.productId !== id));
      this.saveToLocalStorage();
    }
  }

  clearCart() {
    if (this.authService.isLoggedIn) {
      // TODO: Implement API call to clear cart in database (DELETE /cart/items)
    } else {
      this._cart.set([]);
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }
}
