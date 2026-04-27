import { Component, Input } from '@angular/core';
import { OrderDto } from '../../models/order.type';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-order-details',
  imports: [NgOptimizedImage],
  template: `
    @if (order) {
      <div class="order_details">
        <div>
          <h1>Details</h1>
          <p class="bold">Order date</p>
          <p>{{ order.createdDate }}</p>

          <p class="bold">Order ID</p>
          <p>{{ order.id }}</p>

          <p class="bold">Shipping address</p>
          <p>
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
        </div>
        <div>
          <h1>Products</h1>

          @for (item of order.items; track item.product.id) {
            <div>
              <img
                [ngSrc]="item.product.imageUrl || ''"
                priority
                width="100"
                height="100"
                alt="{{ item.product.name }}"
              />
              <div>
                <p class="bold">{{ item.product.name }}</p>
                <p class="bold">{{ item.product.price * item.quantity }}</p>
                <p>{{ item.product.description }}</p>
                <p>Quantity: {{ item.quantity }}</p>
                <p>Unit price: {{ item.product.price }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent {
  @Input() order!: OrderDto | undefined;
}
