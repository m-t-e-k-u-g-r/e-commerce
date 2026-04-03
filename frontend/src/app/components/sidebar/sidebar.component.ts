import { Component, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  template: `
    <div class="sidebar">
      <button (click)="returnHome()">
        All Categories
      </button>
      @for (category of this.categoryService.categories(); track category.id) {
        <button (click)="redirect(category.id, category.name)">
          {{ category.name }}
        </button>
      }
    </div>
  `,
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  categoryService = inject(CategoryService);
  constructor(private router: Router) {}

  returnHome() {
    this.router.navigate(['']);
  }

  redirect(id: number, name: string) {
    const slug = name.toLowerCase()
      .replace(' ', '_')
      .replace('-', '_') + '-' + String(id);
    this.router.navigate(['/c', slug]);
  }
}
