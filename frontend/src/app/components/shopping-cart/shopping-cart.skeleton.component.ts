import { Component } from '@angular/core';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  imports: [NgxSkeletonLoaderComponent],
  selector: 'app-shopping-cart-skeleton',
  template: `
    <div class="table-skeleton">
      <div class="table-header-skeleton">
        <ngx-skeleton-loader [theme]="{ width: '220px', height: '25px', margin_top: '1rem' }">
          appearance="line"
        </ngx-skeleton-loader>
        <ngx-skeleton-loader [theme]="{ width: '125px', height: '40px' }">
          appearance="line"
        </ngx-skeleton-loader>
      </div>
      <div class="table-body-skeleton">
        <div class="table-header-skeleton table-rows-header-skeleton">
          <div></div>
          @for (item of items; track item) {
            <ngx-skeleton-loader class="table-row-element-skeleton">
              appearance="line"
            </ngx-skeleton-loader>
          }
        </div>
        @for (item of [1, 2, 3]; track item) {
          <div class="cart-item-skeleton">
            <ngx-skeleton-loader [theme]="{ width: '100px', height: '100px' }">
              appearance="circle"
            </ngx-skeleton-loader>
            <ngx-skeleton-loader class="table-row-element-skeleton">
              appearance="line"
            </ngx-skeleton-loader>
            <div class="quantity_controls">
              <ngx-skeleton-loader class="button-skeleton">appearance="circle"</ngx-skeleton-loader>
              <ngx-skeleton-loader class="table-row-element-skeleton">
                appearance="line"
              </ngx-skeleton-loader>
              <ngx-skeleton-loader class="button-skeleton">appearance="circle"</ngx-skeleton-loader>
            </div>
            <ngx-skeleton-loader class="table-row-element-skeleton">
              appearance="line"
            </ngx-skeleton-loader>
          </div>
        }
      </div>
      <div class="price-skeleton">
        <ngx-skeleton-loader [theme]="{ width: '170px', height: '30px' }">
          appearance="line"
        </ngx-skeleton-loader>
      </div>
      <ngx-skeleton-loader [theme]="{ width: '100%', height: '40px' }">
        appearance="line"
      </ngx-skeleton-loader>
    </div>
  `,
  styleUrls: ['shopping-cart.skeleton.component.scss', 'shopping-cart.component.scss'],
})
export class ShoppingCartSkeletonComponent {
  items = Array.from({ length: 3 });
}
