import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductComponent } from '../product/product.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  imports: [ProductComponent, SidebarComponent, MatProgressSpinner],
  template: `
    @if (this.loadingService.isLoadingHome()) {
      <mat-spinner class="mat-spinner-global" mode="indeterminate" />
    } @else {
      <div class="home">
        <app-sidebar />
        <section class="product_list">
          @for (product of this.productService.products(); track product.id) {
            @if (categoryId === undefined || product.categoryIds.includes(categoryId)) {
              <app-product [product]="product" />
            }
          }
        </section>
      </div>
    }
  `,
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  productService = inject(ProductService);
  categoryId?: number;
  constructor(private route: ActivatedRoute) {}
  loadingService = inject(LoadingService);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const categorySlug = params.get('slug') ?? undefined;
      if (categorySlug == undefined) return (this.categoryId = undefined);
      const parts = categorySlug.split('-');
      this.categoryId = Number(parts[parts.length - 1]);
    });
  }
}
