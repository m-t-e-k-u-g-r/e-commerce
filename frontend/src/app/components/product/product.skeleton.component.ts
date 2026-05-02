import { Component } from '@angular/core';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-product-skeleton',
  imports: [NgxSkeletonLoaderComponent],
  template: `
    <div class="product product_skeleton">
      <ngx-skeleton-loader class="img_skeleton" [theme]="{ width: '100%', height: '100%' }">
        appearance="line"
      </ngx-skeleton-loader>
      <div class="product_content_skeleton">
        <div class="product_detail product_detail_skeleton">
          <ngx-skeleton-loader [theme]="{ width: '50%', height: '20px', margin_bottom: '0.5rem' }">
            count="1"
            appearance="line"
          </ngx-skeleton-loader>
          <ngx-skeleton-loader [theme]="{ width: '20%', height: '18px' }">
            count="2"
            appearance="line"
          </ngx-skeleton-loader>
        </div>
        <div class="button_container">
          <ngx-skeleton-loader class="button_skeleton">
            appearance="line"
          </ngx-skeleton-loader>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['product.skeleton.component.scss', 'product.component.scss'],
})
export class ProductSkeletonComponent {}
