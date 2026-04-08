import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { OrderDto } from '../models/order.type';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl = environment.apiUrl + 'orders';
  http = inject(HttpClient);
  private _orders = signal<OrderDto[]>([]);
  readonly orders = this._orders.asReadonly();

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
      console.log('Fetched orders:', orders);
      this._orders.set(orders);
    })
  }

  private formatDate(date: string): string {
    const [y, m, d] = date.split('-');
    return `${d}.${m}.${y}`;
  }
}
