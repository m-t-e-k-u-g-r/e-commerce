import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { CreatedGuestOrderDto, GuestOrderDto, OrderDto } from '../models/order.type';
import { finalize, of, throwError } from 'rxjs';
import { CartService } from './cart.service';
import { ConfirmService } from './confirm.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { AddressDto } from '../models/address.type';
import { CartItem } from '../models/cartItem.type';
import { catchError, tap } from 'rxjs/operators';
import { jsonExport, mapToGuestOrderExport } from '../utils';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetailsComponent } from '../components/order-details/order-details.component';
import { AuthService } from './auth.service';
import { Validators } from '@angular/forms';
import { API_TARGET } from '../interceptors/refresh-interceptor';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl = environment.apiUrl + 'orders';
  http = inject(HttpClient);
  private _orders = signal<OrderDto[]>([]);
  readonly orders = this._orders.asReadonly();
  authService = inject(AuthService);
  cartService = inject(CartService);
  confirmService = inject(ConfirmService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  constructor(private dialog: MatDialog) {}
  details = signal<OrderDto | null>(null);
  guestOrderDetails = signal<GuestOrderDto | null>(null);
  loading = signal(false);

  loadOrders() {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.http.get<OrderDto[]>(this.baseUrl,
      { withCredentials: true }
    ).pipe(
      tap(orders => {
        this._orders.set(orders);
      }),
      catchError((err) => {
        this.notificationService.error('Failed to load orders');
        return throwError(() => err);
      })
    ).subscribe();
  }

  async checkGuestOrder() {
    const response = await this.confirmService.confirmOptions({
      title: 'Retrieve order details',
      message: 'Please enter your order ID and token to retrieve your order details.',
      fields: [
        { name: 'orderId', type: 'number', label: 'Order ID', validators: [Validators.required] },
        {
          name: 'token',
          type: 'text',
          label: 'Token',
          validators: [
            Validators.required,
            Validators.pattern(
              /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
            ),
          ],
        },
      ],
    });
    if (response.confirmed) {
      const orderId: number = response.data.orderId;
      const token: string = response.data.token;
      this.getGuestOrder(orderId, token);
    }
  }

  getGuestOrder(orderId: number, token: string) {
    this.loading.set(true);
    const toastId = this.notificationService.pending('Verifying order details...');
    return this.http.get<GuestOrderDto>(this.baseUrl + '/guest/' + orderId, {
      params: new HttpParams().set('token', token)
    })
      .pipe(
        tap((orderDto) => {
          this.guestOrderDetails.set(orderDto);
          this.notificationService.success('Order details verified successfully');
          this.openGuestOrder(orderDto);
        }),
        catchError((err) => {
          if (err.status === 404) {
            this.notificationService.error(`Order #${orderId} not found`);
          } else if (err.status === 403) {
            this.notificationService.error('Invalid token for this order');
          } else {
            this.notificationService.error('Failed to verify order details');
          }
          return throwError(() => err);
        }),
        finalize(() => {
          this.notificationService.clear(toastId);
          this.loading.set(false);
        }),
      ).subscribe();
  }

  createOrder(addressId: number) {
    const toastId = this.notificationService.pending('Placing order...');
    this.loading.set(true);
    return this.http.post<OrderDto>(this.baseUrl, { addressId: addressId },
      { withCredentials: true, context: new HttpContext().set(API_TARGET, 'authenticated') }
    ).pipe(
      tap((order) => {
        this.cartService.loadCartItems();
        this.loadOrders();
        this.router.navigate(['/orders']);
        this.details.set(order);
        this.notificationService.success(`Order #${order.id} placed successfully`);
      }),
      catchError(() => {
        this.notificationService.error('Failed to place order');
        return of(null);
      }),
      finalize(() => {
        this.notificationService.clear(toastId);
        this.loading.set(false);
      })
    ).subscribe();
  }

  createGuestOrder(
    email: string,
    address: AddressDto,
    items: CartItem[]
  ) {
    const toastId = this.notificationService.pending('Placing order...');
    this.loading.set(true);
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
        finalize(() => {
          this.notificationService.clear(toastId);
          this.loading.set(false);
        })
      );
  }

  async cancelOrder(orderId: number) {
    const confirmed = await this.confirmService.confirm({
      title: `Cancel order #${orderId}`,
      message: 'Are you sure you want to cancel this order?',
    });
    if (!confirmed) return;

    const toastId = this.notificationService.pending('Placing order...');
    return this.http.delete<OrderDto>(this.baseUrl + '/' + orderId,
      { withCredentials: true, context: new HttpContext().set(API_TARGET, 'authenticated') }
    ).pipe(
      tap(order => {
        this.loadOrders();
        this.notificationService.success(`Order #${order.id} cancelled`);
      }),
      catchError(() => {
        this.notificationService.error(`Failed to cancel order #${orderId}`);
        return of(null);
      }),
      finalize(() => {
        this.notificationService.clear(toastId);
      })
    );
  }

  openGuestOrder(order: GuestOrderDto) {
    this.dialog.open(OrderDetailsComponent, {
      data: order,
      panelClass: 'order-dialog',
      minWidth: '40vw',
      maxHeight: '90vh'
    });
  }
}
