import { Component, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';

@Component({
  selector: 'app-sidebar',
  imports: [MatButtonToggleGroup, MatButtonToggle],
  template: `
    <mat-button-toggle-group
      [value]="this.categoryService.selectedId() || null"
      (change)="onCategoryChange($event.value)"
      class="sidebar"
    >
      <mat-button-toggle value="null">
        All Categories
      </mat-button-toggle>

      @for (category of this.categoryService.categories(); track category.id) {
        <mat-button-toggle [value]="category.id">
          {{ category.name }}
        </mat-button-toggle>
      }
    </mat-button-toggle-group>
  `,
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  categoryService = inject(CategoryService);

  onCategoryChange(categoryId: number | null) {
    if (categoryId === null) {
      this.categoryService.returnHome();
    } else {
      this.categoryService.redirect(categoryId);
    }
  }
}
