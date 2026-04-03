import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductComponent } from '../product/product.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ProductComponent, SidebarComponent],
  template: `
    <div class="home">
      <app-sidebar />
      <section class="product_list">
        @for (product of this.productService.products(); track product.id) {
          @if (categoryId === undefined) {
            <app-product [product]="product" />
          } @else if (product.categoryIds.includes(categoryId)) {
            <app-product [product]="product" />
          }
        }
      </section>
    </div>
  `,
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  productService = inject(ProductService);
  categoryId?: number;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const categorySlug = params.get('slug') ?? undefined;
      console.log('categorySlug: ', categorySlug)
      if (categorySlug == undefined) return (this.categoryId = undefined);
      const parts = categorySlug.split('-');
      this.categoryId = Number(parts[parts.length - 1]);
    });
  }
}
