import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';
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
      map((products) =>
        products.map(p => ({
          ...p,
          imageUrl: `http://localhost:8080/api/images/${p.imageUrl}`
        }))
      ),
      tap(products => this.products.set(products)),
        catchError(err => {
          console.error('Failed to load products', err);
          this.products.set([]);
          return of([]);
        })
      );
  }
}
