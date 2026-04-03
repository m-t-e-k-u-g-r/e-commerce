import { Component, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';

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

  constructor() {
    effect(() => {
      this.loadData();
    })
  }

  private loadData() {
    this.productService.getProducts();
  }
}
