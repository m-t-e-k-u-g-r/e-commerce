import { Component, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar/>
    <main>
      <router-outlet/>
    </main>
  `,
  styleUrl: './app.css',
})
export class App {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  cartService = inject(CartService);
  authService = inject(AuthService);

  constructor() {
    effect(() => {
      this.authService.getUser().subscribe();
      this.loadData();
    });
  }

  private loadData() {
    this.productService.getProducts();
    this.categoryService.getCategories();
    this.cartService.loadFromLocalStorage();
  }
}
