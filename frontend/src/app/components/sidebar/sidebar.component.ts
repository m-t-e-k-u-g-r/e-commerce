import { Component, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  template: `
    <div class="sidebar">
      @for (category of this.categoryService.categories(); track category.id) {
        <button>
          {{ category.name }}
        </button>
      }
    </div>
  `,
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  categoryService = inject(CategoryService);
}
