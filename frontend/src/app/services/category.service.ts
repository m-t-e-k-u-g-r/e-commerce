import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.type';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.apiUrl + 'categories';
  http = inject(HttpClient);
  categories = signal<Category[]>([]);

  getCategories() {
    return this.http.get<Category[]>(this.baseUrl).pipe(
      tap(categories => this.categories.set(categories)),
        catchError(err => {
          console.error('Failed to load categories', err);
          this.categories.set([]);
          return of([]);
        })
    ).subscribe();
  }
}
