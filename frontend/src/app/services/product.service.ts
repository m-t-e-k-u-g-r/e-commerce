import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { DB_Product, Product } from '../models/product.type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = environment.apiUrl + 'products';
  http = inject(HttpClient);
  products = signal<Product[]>([]);

  loadProducts() {
    return this.http.get<DB_Product[]>(this.baseUrl).pipe(
      map((products: DB_Product[]) =>
        products.map((p: DB_Product) => ({
          ...p,
          imageUrl: `/api/images/products/${p.imageId}`
        }))
      ),
      tap((products: Product[]) => this.products.set(products)),
        catchError(err => {
          console.error('Failed to load products', err);
          this.products.set([]);
          return of([]);
        })
      );
  }
}
