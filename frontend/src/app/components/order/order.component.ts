import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderDto } from '../../models/order.type';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-order',
  imports: [NgOptimizedImage],
  template: `
    <div class="order">
      <h2>Order {{ order.id }} from {{ order.createdDate }}</h2>
      <a (click)="notifyOrderOverview()">Order details</a>
      <p>
        To:
        {{
          order.address.street +
            ' ' +
            order.address.houseNumber +
            ', ' +
            order.address.zipCode +
            ' ' +
            order.address.city
        }}
      </p>
      <div class="item_container">
        @for (item of order.items; track item.product.id) {
          <div class="item">
            <img
              [ngSrc]="item.product.imageUrl || ''"
              priority
              width="100"
              height="100"
              alt="{{ item.product.name }}"
            />
            <div class="details">
              <h3>{{ item.product.name || '' }}</h3>
              <p>Number: {{ item.quantity }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './order.component.css',
})
export class OrderComponent {
  @Input() order!: OrderDto;
  @Output() action = new EventEmitter<OrderDto>();

  notifyOrderOverview() {
    this.action.emit(this.order);
  }
}
