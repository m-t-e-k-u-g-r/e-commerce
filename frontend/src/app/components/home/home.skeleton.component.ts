import { Component } from '@angular/core';
import { SidebarSkeletonComponent } from '../sidebar/sidebar.skeleton.component';
import { ProductSkeletonComponent } from '../product/product.skeleton.component';

@Component({
  imports: [SidebarSkeletonComponent, ProductSkeletonComponent],
  selector: 'app-home-skeleton',
  template: `
    <div class="home">
      <app-sidebar-skeleton />
      <section class="product_list">
        @for (item of items; track item) {
          <app-product-skeleton />
        }
      </section>
    </div>
  `,
  styleUrls: ['home.skeleton.component.scss', 'home.component.scss'],
})
export class HomeSkeletonComponent {
  items = Array.from({ length: 12 }, (_, i) => i);
}
