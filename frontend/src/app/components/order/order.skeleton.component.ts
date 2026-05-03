import { Component } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader } from '@angular/material/card';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  imports: [MatCard, MatCardHeader, NgxSkeletonLoaderComponent, MatCardContent, MatCardActions],
  selector: 'app-order-skeleton',
  template: `
    <mat-card class="order-card order-skeleton">
      <mat-card-header class="header-skeleton">
        <ngx-skeleton-loader
          appearance="line"
          [theme]="{ width: '80px', height: '28px', margin: '0' }"
        />
        <ngx-skeleton-loader appearance="line" [theme]="{ width: '150px', height: '24px', margin: '0' }" />
      </mat-card-header>

      <mat-card-content>
        <div class="status-container">
          <ngx-skeleton-loader appearance="line" [theme]="{ width: '80px', height: '32px', margin: '0' }" />
        </div>

        <p class="address-skeleton">
          <ngx-skeleton-loader appearance="line" [theme]="{ width: '60px', height: '18px', margin: '0' }" />
          <ngx-skeleton-loader
            [count]="1"
            appearance="line"
            [theme]="{ width: '80px', height: '18px', margin: '0' }"
          />
          <ngx-skeleton-loader
            [count]="1"
            appearance="line"
            [theme]="{ width: '130px', height: '18px', margin: '0' }"
          />
        </p>

        <p>
          <ngx-skeleton-loader appearance="line" [theme]="{ width: '200px', height: '22px', margin: '0' }" />
        </p>

        <div class="preview-items">
          @for (item of items; track item) {
            <ngx-skeleton-loader appearance="square" [theme]="{ width: '40px', margin: '0' }"/>
          }
        </div>
      </mat-card-content>

      <mat-card-actions class="button-container-skeleton">
        <ngx-skeleton-loader appearance="line" [theme]="{ width: '90px', height: '18px' }" />
        <ngx-skeleton-loader appearance="line" [theme]="{ width: '50px', height: '18px' }" />
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['order.skeleton.component.scss', 'order.component.scss'],
})
export class OrderSkeletonComponent {
  items = Array.from({ length: 3 }, (_, i) => i);
}
