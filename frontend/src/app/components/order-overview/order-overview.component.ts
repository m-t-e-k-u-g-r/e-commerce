import { Component, inject } from '@angular/core';
import { OrderComponent } from '../order/order.component';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-overview',
  imports: [OrderComponent],
  template: `
    <h1>Orders</h1>
    @for (order of this.orderService.orders(); track order.id) {
      <app-order [order]="order" />
    }
  `,
  styleUrl: './order-overview.component.css',
})
export class OrderOverviewComponent {
  orderService = inject(OrderService);
}
