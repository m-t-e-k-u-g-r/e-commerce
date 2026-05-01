import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Product } from '../models/product.type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = environment.apiUrl + 'products';
  http = inject(HttpClient);
  products = signal<Product[]>([]);

  loadProducts() {
    return this.http.get<Product[]>(this.baseUrl).pipe(
      tap(products => this.products.set(products)),
        catchError(err => {
          console.error('Failed to load products', err);
          this.products.set([]);
          return of([]);
        })
      ).subscribe();
  }
}
