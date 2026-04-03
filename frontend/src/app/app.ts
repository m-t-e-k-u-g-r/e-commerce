import { Component, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main>
      <router-outlet/>
    </main>
  `,
  styleUrl: './app.css'
})
export class App {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);

  constructor() {
    effect(() => {
      this.loadData();
    })
  }

  private loadData() {
    this.productService.getProducts();
    this.categoryService.getCategories();
  }
}
