import { Component, computed, inject, Signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AddressService } from '../../services/address.service';
import { OrderService } from '../../services/order.service';
import { MatTableModule } from '@angular/material/table';
import { computedCartItem } from '../../models/cartItem.type';
import { MatButton } from '@angular/material/button';
import { ConfirmService } from '../../services/confirm.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-shopping-cart',
  imports: [NgOptimizedImage, MatTableModule, MatButton, CurrencyPipe],
  template: `
    <h1>Shopping Cart</h1>
    <div class="shopping_cart">
      <table mat-table [dataSource]="computedCartItems()">
        <ng-container matColumnDef="image">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let item">
            <div class="img_wrapper">
              <img
                [ngSrc]="item.productInfo.imageUrl"
                priority
                width="100"
                height="100"
                [alt]="item.productInfo.name"
              />
            </div>
          </td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>

        <ng-container matColumnDef="product">
          <th mat-header-cell *matHeaderCellDef>Product</th>
          <td mat-cell *matCellDef="let item">{{ item.productInfo.name }}</td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>

        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef style="text-align: center;">Quantity</th>
          <td mat-cell *matCellDef="let item">
            <div class="center quantity_controls">
              <button (click)="this.cartService.reduceQuantity(item.productId)">-</button>
              <span class="quantity_value">{{ item.quantity }} in cart</span>
              <button (click)="this.cartService.addItem(item.productId)">+</button>
            </div>
          </td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Price</th>
          <td mat-cell *matCellDef="let item">
            {{ (item.productInfo.price * item.quantity).toFixed(2) | currency: 'USD' : 'symbol' }}
          </td>
          <td mat-footer-cell *matFooterCellDef>
            <p class="total_amount">
              Total: {{ this.cartService.totalAmount() | currency: 'USD' : 'symbol' }}
            </p>
          </td>
        </ng-container>

        <ng-container matColumnDef="header-row-info">
          <th mat-header-cell *matHeaderCellDef colspan="4">
            <div class="header">
              <span>
                You have {{ this.cartService.totalItems() }} item{{
                  this.cartService.totalItems() == 1 ? '' : 's'
                }}
                in your shopping cart
              </span>
              <button
                (click)="this.cartService.clearCart()"
                matButton="elevated"
                [disabled]="this.disabled()"
              >
                Clear Shopping Cart
              </button>
            </div>
          </th>
        </ng-container>

        <ng-container matColumnDef="footer-row-checkout">
          <td mat-footer-cell *matFooterCellDef colspan="4">
            <button
              (click)="checkout()"
              matButton="filled"
              [disabled]="this.disabled()"
            >
              Check out
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="['header-row-info']"></tr>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns" class="divided"></tr>
        <tr mat-footer-row *matFooterRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-footer-row *matFooterRowDef="['footer-row-checkout']; sticky: true"></tr>
      </table>
    </div>
  `,
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent {
  cartService = inject(CartService);
  productService = inject(ProductService);
  addressService = inject(AddressService);
  orderService = inject(OrderService);
  authService = inject(AuthService);
  confirmService = inject(ConfirmService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  displayedColumns: string[] = ['image', 'product', 'quantity', 'price'];
  disabled = computed(() => {
    return this.computedCartItems().length == 0 || this.orderService.loading()
  });

  computedCartItems: Signal<computedCartItem[]> = computed(() => {
    const products = this.productService.products();
    const cartItems = this.cartService.cart();

    const productMap = new Map(products.map((p) => [p.id, p]));

    return cartItems.flatMap((cartItem) => {
      const product = productMap.get(cartItem.productId);

      return product ? [{ ...cartItem, productInfo: product }] : [];
    });
  });

  async checkout() {
    if (!this.authService.isLoggedIn()) {
      this.handleGuestCheckout();
      return;
    }
    const billingAddress = this.addressService.billingAddress();
    if (billingAddress == null) {
      this.notificationService.info('Please create a billing address');
      this.router.navigate(['/address/new']);
      return;
    }
    const addresses = this.addressService.addresses();
    const options = addresses.map(a => ({
      label: `${a.street} ${a.houseNumber}`,
      value: a.id
    }));
    const response = await this.confirmService.confirmOptions({
      title: 'Place order',
      message: `Are you sure you want to place an order for $ ${this.cartService.totalAmount()}?`,
      fields: [
        {
          name: 'address',
          type: 'select',
          defaultValue: billingAddress.id,
          label: 'Shipping address',
          options: options,
        },
      ],
    });
    if (response.confirmed) {
      const id: number = response.data.address;
      this.orderService.createOrder(id);
    }
  }

  async handleGuestCheckout() {
    const address = this.addressService.guestAddress();
    if (address == null) {
      this.notificationService.warning('Please save an address first', 'No address found');
      return this.router.navigate(['/address/new']);
    }

    const response = await this.confirmService.confirmOptions({
      title: '',
      message: 'Please enter your email to place an order',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'E-Mail',
          required: true,
          placeholder: 'example@email.com',
        },
      ],
    });
    if (!response.confirmed) return this.notificationService.info('Order placement canceled');

    const email: string = response.data.email;
    const cartItems = this.cartService.cart();
    this.orderService.createGuestOrder(email, address, cartItems).subscribe();
  }
}
