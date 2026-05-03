import { inject, Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cartItem.type';
import { environment } from '../../environments/environment.development';
import { ProductService } from './product.service';
import { AuthService } from './auth.service';
import { HttpClient, HttpContext } from '@angular/common/http';
import { API_TARGET } from '../interceptors/refresh-interceptor';
import { NotificationService } from './notification.service';
import { ConfirmService } from './confirm.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { finalize, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  baseUrl = environment.apiUrl + 'cart';
  http = inject(HttpClient);
  productService = inject(ProductService);
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  confirmService = inject(ConfirmService);
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
    }, 0).toFixed(2)
  );
  loadingProducts = signal<number[] | null>(null);
  private setProductLoading(productId: number) {
    this.loadingProducts.update((current) => [...(current ?? []), productId]);
  }
  private setProductNotLoading(productId: number) {
    this.loadingProducts.update((current) => current?.filter((id) => id !== productId) ?? null);
  }

  loadCartItems() {
    if (this.authService.isLoggedIn()) {
      return this.http.get<CartItem[]>(this.baseUrl + '/items',
        { withCredentials: true, context: new HttpContext().set(API_TARGET, 'authenticated') }
      ).pipe(
        tap((items: CartItem[]) => {
          this._cart.set(items);
        }),
        catchError((err) => {
          this.notificationService.error('Could not load cart items');
          return throwError(() => err);
        })
      );
    } else {
      const cart = localStorage.getItem('cart');
      if (cart) {
        try {
          const json = JSON.parse(cart);
          this._cart.set(json);
        } catch {}
      }
      return of(null);
    }
  }

  addItem(productId: number) {
    if (this.authService.isLoggedIn()) {
      this.setProductLoading(productId);
      this.http.post(this.baseUrl + '/items/' + productId, {},
        { withCredentials: true, context: new HttpContext().set(API_TARGET, 'authenticated') }
      ).pipe(
        switchMap(() => this.loadCartItems()),
        catchError((err) => {
          this.notificationService.error('Could not add item to cart');
          return throwError(() => err)
        }),
        finalize(() => this.setProductNotLoading(productId))
      ).subscribe();
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
          this.setProductLoading(productId);
          return this.http.put(this.baseUrl + '/items/' + item.id, { quantity: newQuantity },
            { withCredentials: true, context: new HttpContext().set(API_TARGET, 'authenticated') }
          ).pipe(
            switchMap(() => this.loadCartItems()),
            catchError((err) => {
              this.notificationService.error('Could not reduce quantity. Please try again');
              return throwError(() => err);
            }),
            finalize(() => this.setProductNotLoading(productId))
          ).subscribe();
        } else {
          this.removeItem(productId);
          return this.loadCartItems();
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
        return this.http
          .delete(this.baseUrl + '/items/' + item.id,
            { withCredentials: true, context: new HttpContext().set(API_TARGET, 'authenticated') }
          ).pipe(
            switchMap(() => this.loadCartItems()),
            catchError((err) => {
              this.notificationService.error('Could not remove product. Please try again');
              return throwError(() => throwError(() => err));
            })
          ).subscribe();
      }
    } else {
      this._cart.update((items) => items.filter((item) => item.productId !== productId));
      this.saveToLocalStorage();
    }
    return;
  }

  async clearCart(skipConfirmation: boolean = false) {
    if (!skipConfirmation) {
      const confirmed = await this.confirmService.confirm({
        title: 'Clear cart',
        message: 'Are you sure you want to clear your cart?',
        messageType: 'text'
      });
      if (!confirmed) return;
    }
    if (this.authService.isLoggedIn()) {
      const toastId = this.notificationService.pending('Clearing cart...');
      this.http
        .delete(this.baseUrl, {
          withCredentials: true,
          context: new HttpContext().set(API_TARGET, 'authenticated'),
        })
        .pipe(
          switchMap(() => {
            this.notificationService.success('Cleared cart');
            return this.loadCartItems();
          }),
          catchError(() => {
            this.notificationService.error('Failed to clear cart');
            return of(null);
          }),
          finalize(() => {
            this.notificationService.clear(toastId);
          }),
        ).subscribe();
    } else {
      this._cart.set([]);
      this.saveToLocalStorage();
      this.notificationService.success('Cleared cart');
    }
    return;
  }

  private saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }
}
