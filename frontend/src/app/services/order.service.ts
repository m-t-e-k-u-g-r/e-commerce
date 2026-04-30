import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CreatedGuestOrderDto, OrderDto } from '../models/order.type';
import { map, of } from 'rxjs';
import { CartService } from './cart.service';
import { ConfirmService } from './confirm.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { AddressDto } from '../models/address.type';
import { CartItem } from '../models/cartItem.type';
import { catchError, tap } from 'rxjs/operators';
import { jsonExport, mapToGuestOrderExport } from '../utils';

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
  notificationService = inject(NotificationService);
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
    ).pipe(
      tap((order) => {
        this.cartService.getCartItems();
        this.getOrders();
        this.router.navigate(['/orders']);
        this.details.set(order);
        this.notificationService.success(`Order #${order.id} placed successfully`);
      }),
      catchError(() => {
        this.notificationService.error('Please try again', 'Failed to place order');
        return of(null);
      })
    );
  }

  createGuestOrder(
    email: string,
    address: AddressDto,
    items: CartItem[]
  ) {
    return this.http
      .post<CreatedGuestOrderDto>(this.baseUrl + '/guest', {
        email: email,
        address: address,
        items: items,
      })
      .pipe(
        tap(async (order) => {
          this.cartService.clearCart(true);
          this.notificationService.success(`Order # ${order.id} created`);

          const orderId = order.id;
          const accessToken = order.accessToken;

          navigator.clipboard.writeText(accessToken);
          this.notificationService.info('Access token has been copied to clipboard');

          const confirmed = await this.confirmService.confirm({
            title: `Order #${orderId} has been placed`,
            message: `
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Access Token:</strong></p>
              <code id="access-token">
                ${accessToken}
              </code>
              <p>
                Please save this token as well as your order ID. You will need them to access your order later.
              </p>
              <p>
                For security reasons, this will not be shown again.
              </p>
              <p>
                Click <i>Confirm</i> to download the details of your order.
              </p>
            `,
            messageType: 'html',
          });
          if (confirmed) {
            const exportData = mapToGuestOrderExport(order);
            jsonExport(exportData, `order_${orderId}`);
          }
        }),
        catchError(() => {
          this.notificationService.error('Please try again.', 'Failed to place order');
          return of(null);
        }),
      );
  }

  async cancelOrder(orderId: number) {
    const confirmed = await this.confirmService.confirm({ title: `Cancel order #${orderId}`, message: 'Are you sure you want to cancel this order?' });
    if (!confirmed) return;
    return this.http.delete<OrderDto>(this.baseUrl + '/' + orderId,
      { withCredentials: true }
    ).pipe(
      tap((order) => {
        this.getOrders();
        this.notificationService.success(`Order #${order.id} cancelled`);
      }),
      catchError(() => {
        this.notificationService.error('Please try again.', `Failed to cancel order #${orderId}`);
        return of(null);
      })
    );
  }

  private formatDate(date: string): string {
    const [y, m, d] = date.split('-');
    return `${d}.${m}.${y}`;
  }
}
