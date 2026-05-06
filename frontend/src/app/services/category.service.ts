import { Injectable, inject, signal, computed } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.type';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.apiUrl + 'categories';
  http = inject(HttpClient);
  router = inject(Router);
  categories = signal<Category[]>([]);
  selectedCategory = signal<Category | null>(null);
  readonly selectedId = computed(() => this.selectedCategory()?.id ?? null);

  returnHome() {
    this.selectedCategory.set(null);
    this.router.navigate(['']);
  }

  redirect(id: number) {
    const category = this.categories().find(c => c.id === id);
    if (category) {
      this.selectedCategory.set(category);
      const name = category.name;
      const slug = name.toLowerCase().replace(' ', '_').replace('-', '_') + '-' + String(id);
      this.router.navigate(['/c', slug]);
    } else {
      this.returnHome();
    }
  }

  loadCategories() {
    return this.http
      .get<Category[]>(this.baseUrl)
      .pipe(
        tap((categories) => {
          this.categories.set(categories)
        }),
        catchError((err) => {
          this.categories.set([]);
          return throwError(() => err);
        }),
      );
  }
}
