import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { OrderDto } from '../models/order.type';
import { map } from 'rxjs';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl = environment.apiUrl + 'orders';
  http = inject(HttpClient);
  private _orders = signal<OrderDto[]>([]);
  readonly orders = this._orders.asReadonly();
  cartService = inject(CartService);

  getOrders() {
    return this.http.get<OrderDto[]>(this.baseUrl,
      { withCredentials: true }
    ).pipe(
      map(orders =>
        orders.map(o => ({
          ...o,
          createdDate: this.formatDate(o.createdDate),
        }))
      )
    ).subscribe(orders => {
      this._orders.set(orders);
    })
  }

  createOrder(addressId: number) {
    return this.http.post<OrderDto>(this.baseUrl, { addressId: addressId },
      { withCredentials: true }
    ).subscribe(order => {
      this.cartService.getCartItems();
      this.getOrders();
    });
  }

  cancelOrder(orderId: number) {
    return this.http.delete<OrderDto>(this.baseUrl + '/' + orderId,
      { withCredentials: true }
    ).subscribe(order => {
      this.getOrders();
    });
  }

  private formatDate(date: string): string {
    const [y, m, d] = date.split('-');
    return `${d}.${m}.${y}`;
  }
}
