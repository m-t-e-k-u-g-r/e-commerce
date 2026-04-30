import { Component, inject, Inject, Input, Optional } from '@angular/core';
import { GuestOrderDto, OrderDto } from '../../models/order.type';
import { NgOptimizedImage, CurrencyPipe } from '@angular/common';
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle, MatCardHeader, MatCardActions } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { isUserOrder } from '../../guards/orderType.guard';
import { MatButton } from '@angular/material/button';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-details',
  imports: [
    NgOptimizedImage,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
    MatCardHeader,
    MatListModule,
    MatDividerModule,
    MatChipsModule,
    CurrencyPipe,
    MatButton,
    MatCardActions,
  ],
  template: `
    @if (order) {
      <mat-card class="details-card">
        <mat-card-header>
          <mat-card-title>Order Details</mat-card-title>
          <mat-card-subtitle>Order #{{ order.id }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="info-section">
            <div class="info-item">
              <span class="label">Status</span>
              <mat-chip-set>
                <mat-chip
                  [class.pending]="order.status === 'PENDING'"
                  [class.cancelled]="order.status === 'CANCELLED'"
                >
                  {{ order.status }}
                </mat-chip>
              </mat-chip-set>
            </div>
            <div class="info-item">
              <span class="label">Order date</span>
              <span>{{ order.createdDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">Shipping address</span>
              <span>
                {{ order.address.street }} {{ order.address.houseNumber }},<br />
                {{ order.address.zipCode }} {{ order.address.city }}
              </span>
            </div>
          </div>

          <mat-divider></mat-divider>

          <h3>Products</h3>
          <mat-list>
            @for (item of order.items; track item.product.id) {
              <mat-list-item class="product-item">
                <img
                  matListItemIcon
                  [ngSrc]="item.product.imageUrl || ''"
                  width="100"
                  height="100"
                  alt="{{ item.product.name }}"
                  class="product-img"
                />
                <div matListItemTitle class="product-name">{{ item.product.name }}</div>
                <div matListItemLine class="product-info">
                  {{ item.quantity }} x {{ item.product.price | currency: 'USD' : 'symbol' }}
                </div>
                <div matListItemLine class="product-total">
                  = {{ item.product.price * item.quantity | currency: 'USD' : 'symbol' }}
                </div>
              </mat-list-item>
              <mat-divider inset></mat-divider>
            }
          </mat-list>

          <div class="total-section">
            <div class="total-row">
              <span class="total-label">Total amount</span>
              <span class="total-amount">{{ order.totalPrice | currency: 'USD' : 'symbol' }}</span>
            </div>
          </div>
        </mat-card-content>

        @if (!isUserOrder(order)) {
          <mat-card-actions>
            <button matButton (click)="closeDialog()">CLOSE</button>
            <button
              matButton
              (click)="this.orderService.cancelOrder(order.id)"
              [disabled]="order.status !== 'PENDING'"
            >
              CANCEL
            </button>
          </mat-card-actions>
        }
      </mat-card>
    }
  `,
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent {
  @Input() order!: GuestOrderDto | OrderDto | undefined;
  protected orderService = inject(OrderService);

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: GuestOrderDto,
    @Optional() private dialogRef?: MatDialogRef<OrderDetailsComponent>,
  ) {
    if (!this.order && dialogData) {
      this.order = dialogData;
    }
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  protected readonly isUserOrder = isUserOrder;
}
