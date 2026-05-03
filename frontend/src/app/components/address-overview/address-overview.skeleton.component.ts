import { Component } from '@angular/core';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  imports: [NgxSkeletonLoaderComponent],
  selector: 'app-address-overview-skeleton',
  template: `
    <div class="address-overview address_overview_skeleton">
      <div class="address-skeleton">
        <div></div>
        <ngx-skeleton-loader [theme]="{ width: '50px', height: '20px' }">
          appearance="line"
        </ngx-skeleton-loader>
        <ngx-skeleton-loader [theme]="{ width: '70px', height: '20px' }">
          appearance="line"
        </ngx-skeleton-loader>
        <div></div>
      </div>
      @for (item of items; track item) {
        <div class="address-skeleton">
          <ngx-skeleton-loader [theme]="{ width: '38px', height: '38px'}">
            appearance="circle"
          </ngx-skeleton-loader>
          <ngx-skeleton-loader [theme]="{ width: '70px', height: '20px' }">
            appearance="line"
          </ngx-skeleton-loader>
          <div class="address-info">
            <ngx-skeleton-loader [theme]="{ width: '80px', height: '20px' }">
              appearance="line"
            </ngx-skeleton-loader>
            <br/>
            <ngx-skeleton-loader [theme]="{ width: '150px', height: '20px' }">
              appearance="line"
            </ngx-skeleton-loader>
            <br/>
            <ngx-skeleton-loader [theme]="{ width: '50px', height: '20px' }">
              appearance="line"
            </ngx-skeleton-loader>
          </div>
          <ngx-skeleton-loader [theme]="{ width: '38px', height: '38px'}">
            appearance="circle"
          </ngx-skeleton-loader>
        </div>
      }
      <ngx-skeleton-loader
        [theme]="{ width: '170px', height: '50px', border_radius: '16px' }"
      >
        appearance="line"
      </ngx-skeleton-loader>
    </div>
  `,
  styleUrls: ['address-overview.skeleton.component.scss', 'address-overview.component.scss'],
})
export class AddressOverviewSkeletonComponent {
  items = Array.from({ length: 2 });
}
