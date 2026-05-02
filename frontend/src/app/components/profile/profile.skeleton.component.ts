import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-profile-skeleton',
  imports: [MatCard, NgxSkeletonLoaderComponent],
  template: `
    <mat-card class="profile-container">
      <div class="profile-skeleton">
        <div class="profile-header-skeleton">
          <ngx-skeleton-loader
            appearance="circle"
            [theme]="{ width: '64px', height: '64px' }"
          >
          </ngx-skeleton-loader>

          <div class="header-text">
            <ngx-skeleton-loader
              [theme]="{ width: '220px', height: '24px' }"
            >
            </ngx-skeleton-loader>

            <ngx-skeleton-loader
              [theme]="{ width: '140px', height: '18px' }"
            >
            </ngx-skeleton-loader>
          </div>
        </div>

        <div class="profile-body-skeleton">
          <ngx-skeleton-loader [count]="3">
          </ngx-skeleton-loader>

          <div class="button-row">
            <ngx-skeleton-loader [theme]="{ width: '100px', height: '36px' }">
            </ngx-skeleton-loader>

            <ngx-skeleton-loader [theme]="{ width: '100px', height: '36px' }">
            </ngx-skeleton-loader>
          </div>
        </div>
      </div>
    </mat-card>
  `,
  styleUrls: ['profile.skeleton.component.scss', 'profile.component.scss'],
})
export class ProfileSkeletonComponent {}
