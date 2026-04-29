import { Component, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { AddressService } from './services/address.service';
import { OrderService } from './services/order.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar/>
    <main>
      <router-outlet/>
    </main>
  `,
  styleUrl: './app.scss',
})
export class App {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  cartService = inject(CartService);
  authService = inject(AuthService);
  addressService = inject(AddressService);
  orderService = inject(OrderService);
  themeService = inject(ThemeService);

  constructor() {
    effect(() => {
      this.authService.getUser().subscribe();
      if (this.authService.isLoggedIn()) {
        this.addressService.getAddresses();
        this.orderService.getOrders();
      }
      this.loadData();
    });
  }

  private loadData() {
    this.productService.getProducts();
    this.categoryService.getCategories();
    this.cartService.getCartItems();
    this.themeService.loadTheme();
  }
}
