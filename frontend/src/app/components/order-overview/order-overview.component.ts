import { Component, effect, inject } from '@angular/core';
import { OrderComponent } from '../order/order.component';
import { OrderService } from '../../services/order.service';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import { OrderDto } from '../../models/order.type';
import { LoadingService } from '../../services/loading.service';
import { OrderOverviewSkeletonComponent } from './order-overview.skeleton.component';

@Component({
  selector: 'app-order-overview',
  imports: [OrderComponent, OrderDetailsComponent, OrderOverviewSkeletonComponent],
  template: `
    <div class="container">
      <header>
        <h1>My Orders</h1>
      </header>

      @if (this.loadingService.isLoadingUserData()) {
        <app-order-overview-skeleton />
      } @else {
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
      }
    </div>
  `,
  styleUrl: './order-overview.component.scss',
})
export class OrderOverviewComponent {
  loadingService = inject(LoadingService);
  showDetails = false;
  orderDetails: OrderDto | undefined = undefined;
  constructor(protected orderService: OrderService) {
    effect(() => {
      const details = this.orderService.details();
      if (details) {
        this.openDetails(details);
      }
    });
  }

  openDetails(order: OrderDto) {
    this.showDetails = true;
    this.orderDetails = order;
  }
}
