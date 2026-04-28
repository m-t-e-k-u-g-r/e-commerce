import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { OrderDto } from '../models/order.type';
import { map } from 'rxjs';
import { CartService } from './cart.service';
import { ConfirmService } from './confirm.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl = environment.apiUrl + 'orders';
  http = inject(HttpClient);
  private _orders = signal<OrderDto[]>([]);
  readonly orders = this._orders.asReadonly();
  cartService = inject(CartService);
  confirmService = inject(ConfirmService);
  router = inject(Router);
  details = signal<OrderDto | null>(null);

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
      this.router.navigate(['/orders']);
      this.details.set(order);
    });
  }

  async cancelOrder(orderId: number) {
    const confirmed = await this.confirmService.confirm({ title: `Cancel order #${orderId}`, message: 'Are you sure you want to cancel this order?' });
    if (!confirmed) return;
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
