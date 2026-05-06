import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { OrderDto } from '../../models/order.type';
import { NgOptimizedImage, CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardSubtitle, MatCardTitle, MatCardActions, MatCardHeader } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-order',
  imports: [
    NgOptimizedImage,
    MatButton,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
    MatCardActions,
    MatCardHeader,
    MatChipsModule,
    CurrencyPipe,
    DatePipe,
  ],
  template: `
    <mat-card class="order-card">
      <mat-card-header>
        <mat-card-title>Order #{{ order.id }}</mat-card-title>
        <mat-card-subtitle>{{ order.createdAt | date: 'medium' }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="status-container">
          <mat-chip-set>
            <mat-chip
              [class.pending]="order.status === 'PENDING'"
              [class.cancelled]="order.status === 'CANCELLED'"
            >
              {{ order.status }}
            </mat-chip>
          </mat-chip-set>
        </div>

        <p class="address">
          <strong>Delivery to:</strong><br />
          {{ order.address.street }} {{ order.address.houseNumber }}<br />
          {{ order.address.zipCode }} {{ order.address.city }}
        </p>

        <p class="total">
          <strong>Total amount:</strong> {{ order.totalPrice | currency: 'USD' : 'symbol' }}
        </p>

        <div class="preview-items">
          @for (item of order.items.slice(0, 3); track item.product.id) {
            <img
              [ngSrc]="item.product.imageUrl || ''"
              width="40"
              height="40"
              alt="{{ item.product.name }}"
              class="preview-img"
            />
          }
          @if (order.items.length > 3) {
            <span class="more-items">+{{ order.items.length - 3 }} more</span>
          }
        </div>
      </mat-card-content>

      <mat-card-actions>
        <button mat-button color="primary" (click)="notifyOrderOverview()">SHOW DETAILS</button>
        @if (order.status === 'PENDING') {
          <button mat-button color="warn" (click)="this.orderService.cancelOrder(this.order.id)">
            CANCEL
          </button>
        }
      </mat-card-actions>
    </mat-card>
  `,
  styleUrl: './order.component.scss',
})
export class OrderComponent {
  @Input() order!: OrderDto;
  @Output() action = new EventEmitter<OrderDto>();
  orderService = inject(OrderService);

  notifyOrderOverview() {
    this.action.emit(this.order);
  }
}
