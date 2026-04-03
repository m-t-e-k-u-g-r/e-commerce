import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductComponent } from '../product/product.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  imports: [ProductComponent, SidebarComponent],
  template: `
    <div class="home">
      <app-sidebar />
      <section class="product_list">
        @for (product of this.productService.products(); track product.id) {
          <app-product [product]="product" />
        }
      </section>
    </div>
  `,
  styleUrl: './home.component.css',
})
export class HomeComponent {
  productService = inject(ProductService);
}
