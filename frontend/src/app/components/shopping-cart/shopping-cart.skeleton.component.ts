import { Component } from '@angular/core';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  imports: [NgxSkeletonLoaderComponent],
  selector: 'app-shopping-cart-skeleton',
  template: `
    <div class="table-skeleton">
      <div class="table-header-skeleton">
        <ngx-skeleton-loader
          appearance="line"
          [theme]="{ width: '220px', height: '25px', margin_top: '1rem' }"
        />
        <ngx-skeleton-loader appearance="line" [theme]="{ width: '125px', height: '40px' }" />
      </div>
      <div class="table-body-skeleton">
        <div class="table-header-skeleton table-rows-header-skeleton">
          <div></div>
          @for (item of items; track item) {
            <ngx-skeleton-loader appearance="line" class="table-row-element-skeleton" />
          }
        </div>
        @for (item of items; track item) {
          <div class="cart-item-skeleton">
            <ngx-skeleton-loader appearance="line" [theme]="{ width: '100px', height: '100px' }" />
            <ngx-skeleton-loader appearance="line" class="table-row-element-skeleton" />
            <div class="quantity_controls">
              <ngx-skeleton-loader appearance="circle" class="button-skeleton" />
              <ngx-skeleton-loader appearance="line" class="table-row-element-skeleton" />
              <ngx-skeleton-loader appearance="circle" class="button-skeleton" />
            </div>
            <ngx-skeleton-loader appearance="line" class="table-row-element-skeleton" />
          </div>
        }
      </div>
      <div class="price-skeleton">
        <ngx-skeleton-loader appearance="line" [theme]="{ width: '170px', height: '30px' }" />
      </div>
      <ngx-skeleton-loader appearance="line" [theme]="{ width: '100%', height: '40px' }" />
    </div>
  `,
  styleUrls: ['shopping-cart.skeleton.component.scss', 'shopping-cart.component.scss'],
})
export class ShoppingCartSkeletonComponent {
  items = Array.from({ length: 3 }, (_, i) => i);
}
