import { Component } from '@angular/core';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-product-skeleton',
  imports: [NgxSkeletonLoaderComponent],
  template: `
    <div class="product product_skeleton">
      <ngx-skeleton-loader appearance="line" class="img_skeleton" [theme]="{ width: '100%', height: '100%' }"/>
      <div class="product_content_skeleton">
        <div class="product_detail product_detail_skeleton">
          <ngx-skeleton-loader [count]="1" appearance="line" [theme]="{ width: '50%', height: '20px', margin_bottom: '0.5rem' }"/>
          <ngx-skeleton-loader [count]="2" appearance="line" [theme]="{ width: '20%', height: '18px' }"/>
        </div>
        <div class="button_container">
          <ngx-skeleton-loader appearance="line" class="button_skeleton"/>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['product.skeleton.component.scss', 'product.component.scss'],
})
export class ProductSkeletonComponent {}
