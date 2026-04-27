import { Component, inject } from '@angular/core';
import { OrderComponent } from '../order/order.component';
import { OrderService } from '../../services/order.service';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import { OrderDto } from '../../models/order.type';

@Component({
  selector: 'app-order-overview',
  imports: [OrderComponent, OrderDetailsComponent],
  template: `
    <h1>Orders</h1>
    <div class="main">
      <div class="order_overview_container">
        @for (order of this.orderService.orders(); track order.id) {
          <app-order [order]="order" (action)="openDetails($event)" />
        }
      </div>
      @if (showDetails) {
        <app-order-details
          [order]="orderDetails"
        />
      }
    </div>
  `,
  styleUrl: './order-overview.component.css',
})
export class OrderOverviewComponent {
  orderService = inject(OrderService);
  showDetails = false;
  orderDetails: OrderDto | undefined = undefined;

  openDetails(order: OrderDto) {
    this.showDetails = true;
    this.orderDetails = order;
  }
}
