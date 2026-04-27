import { Component, inject } from '@angular/core';
import { OrderComponent } from '../order/order.component';
import { OrderService } from '../../services/order.service';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import { OrderDto } from '../../models/order.type';

@Component({
  selector: 'app-order-overview',
  imports: [OrderComponent, OrderDetailsComponent],
  template: `
    <div class="container">
      <header>
        <h1>My Orders</h1>
      </header>

      <div class="layout-wrapper">
        <section class="orders-list">
          <div class="grid-container">
            @for (order of this.orderService.orders(); track order.id) {
              <app-order
                [order]="order"
                (action)="openDetails($event)"
                [class.active]="orderDetails?.id === order.id"
              ></app-order>
            }
          </div>
        </section>

        <aside class="details-panel" [class.visible]="showDetails">
          @if (showDetails) {
            <app-order-details [order]="orderDetails" />
          } @else {
            <div class="no-selection">
              <p>Select an order to view details.</p>
            </div>
          }
        </aside>
      </div>
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
