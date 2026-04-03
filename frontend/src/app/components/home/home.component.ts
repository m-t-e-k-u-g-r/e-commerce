import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-home',
  imports: [
    ProductComponent
  ],
  template: `
    <section class="product_list">
      @for (product of this.productService.products(); track product.id) {
        <app-product [product]="product"/>
      }
    </section>
  `,
  styleUrl: './home.component.css',
})
export class HomeComponent {
  productService = inject(ProductService);
}
