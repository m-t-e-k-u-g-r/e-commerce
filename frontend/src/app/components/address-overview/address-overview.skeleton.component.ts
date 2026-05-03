import { Component } from '@angular/core';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  imports: [NgxSkeletonLoaderComponent],
  selector: 'app-address-overview-skeleton',
  template: `
    <div class="address-overview address_overview_skeleton">
      <div class="address-skeleton">
        <div></div>
        <ngx-skeleton-loader appearance="line" [theme]="{ width: '50px', height: '20px' }" />
        <ngx-skeleton-loader appearance="line" [theme]="{ width: '70px', height: '20px' }" />
        <div></div>
      </div>
      @for (item of items; track item) {
        <div class="address-skeleton">
          <ngx-skeleton-loader appearance="circle" [theme]="{ width: '38px', height: '38px' }" />
          <ngx-skeleton-loader appearance="line" [theme]="{ width: '70px', height: '20px' }" />
          <div class="address-info">
            <ngx-skeleton-loader appearance="line" [theme]="{ width: '80px', height: '20px' }" />
            <br />
            <ngx-skeleton-loader appearance="line" [theme]="{ width: '150px', height: '20px' }" />
            <br />
            <ngx-skeleton-loader appearance="line" [theme]="{ width: '50px', height: '20px' }" />
          </div>
          <ngx-skeleton-loader appearance="circle" [theme]="{ width: '38px', height: '38px' }" />
        </div>
      }
      <ngx-skeleton-loader
        appearance="line"
        [theme]="{ width: '170px', height: '50px', border_radius: '16px' }"
      />
    </div>
  `,
  styleUrls: ['address-overview.skeleton.component.scss', 'address-overview.component.scss'],
})
export class AddressOverviewSkeletonComponent {
  items = Array.from({ length: 2 }, (_, i) => i);
}
