import { Component } from '@angular/core';
import { OrderSkeletonComponent } from '../order/order.skeleton.component';
import { OrderDetailsSkeletonComponent } from '../order-details/order-details.skeleton.component';

@Component({
  imports: [OrderSkeletonComponent, OrderDetailsSkeletonComponent],
  selector: 'app-order-overview-skeleton',
  template: `
    <div class="layout-wrapper">
      <section class="orders-list">
        <div class="grid-container">
          @for (item of items; track item) {
            <app-order-skeleton />
          }
        </div>
      </section>
      <aside class="details-panel visible">
        <app-order-details-skeleton />
      </aside>
    </div>
  `,
  styleUrl: 'order-overview.component.scss',
})
export class OrderOverviewSkeletonComponent {
  items = Array.from({ length: 4 }, (_, i) => i);
}
