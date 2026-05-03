import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatDivider } from '@angular/material/list';

@Component({
  imports: [
    MatCard,
    MatCardHeader,
    NgxSkeletonLoaderComponent,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatDivider,
  ],
  selector: 'app-order-details-skeleton',
  template: `
    <mat-card class="details-card details-card-skeleton">
      <mat-card-header>
        <mat-card-title>
          <ngx-skeleton-loader appearance="line" [theme]="{ width: '125px', height: '28px' }" />
        </mat-card-title>
        <mat-card-subtitle>
          <ngx-skeleton-loader appearance="line" [theme]="{ width: '65px', height: '24px' }" />
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="info-section">
          <div class="info-item">
            <ngx-skeleton-loader appearance="line" [theme]="{ height: '30px', width: '80px' }" />
          </div>
          <div class="info-item">
            <ngx-skeleton-loader appearance="line" [theme]="{ height: '18px', width: '170px' }" />
          </div>
          <div class="info-item">
            <ngx-skeleton-loader appearance="line" [theme]="{ height: '18px', width: '75px' }" />
            <ngx-skeleton-loader appearance="line" [theme]="{ height: '18px', width: '150px' }" />
          </div>
        </div>

        <mat-divider></mat-divider>

        <div style="margin-top: 1.5rem; margin-bottom: 0.8rem;">
          <ngx-skeleton-loader appearance="line" [theme]="{ height: '18px', width: '75px' }" />
        </div>

        <div>
          @for (item of items; track item) {
            <div class="product-item product-item-skeleton">
              <ngx-skeleton-loader appearance="square" [theme]="{ width: '40px' }" class="product-img"/>
              <div class="product-info-skeleton">
                <ngx-skeleton-loader appearance="line" [theme]="{ height: '18px', width: '150px' }" />
                @for (i of [1, 2]; track i) {
                  <ngx-skeleton-loader appearance="line" [theme]="{ height: '16px', width: '100px' }" />
                }
              </div>
            </div>
            <mat-divider inset></mat-divider>
          }
        </div>

        <div class="total-section">
          <div class="total-row">
            @for (i of [1, 2]; track i) {
              <ngx-skeleton-loader appearance="line" [theme]="{ height: '20px', width: '100px' }"/>
            }
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['order-details.skeleton.component.scss', 'order-details.component.scss'],
})
export class OrderDetailsSkeletonComponent {
  items = Array.from({ length: 5 }, (_, i) => i);
}
