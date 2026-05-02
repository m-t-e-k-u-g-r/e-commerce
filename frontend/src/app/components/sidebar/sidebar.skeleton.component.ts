import { Component } from '@angular/core';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-sidebar-skeleton',
  imports: [NgxSkeletonLoaderComponent],
  template: `
    <div class="toggle-group-skeleton">
      @for (item of items; track item) {
        <ngx-skeleton-loader>
          appearance="line"
        </ngx-skeleton-loader>
      }
    </div>
  `,
  styleUrls: ['sidebar.skeleton.component.scss', 'sidebar.component.scss'],
})
export class SidebarSkeletonComponent {
  items = Array.from({ length: 10 });
}
