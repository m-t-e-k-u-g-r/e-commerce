import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { AddressService } from './services/address.service';
import { OrderService } from './services/order.service';
import { ThemeService } from './services/theme.service';
import { UserService } from './services/user.service';
import { take } from 'rxjs';

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
export class App implements OnInit {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  cartService = inject(CartService);
  authService = inject(AuthService);
  userService = inject(UserService);
  addressService = inject(AddressService);
  orderService = inject(OrderService);
  themeService = inject(ThemeService);

  constructor() {
    this.authService.ready$
      .pipe(
        take(1)
      ).subscribe(() => {
        this.orderService.loadOrders();
        this.cartService.loadCartItems();
        this.addressService.loadAddresses();
      });
  }

  ngOnInit() {
    this.userService.getUser().subscribe();

    this.productService.loadProducts();
    this.categoryService.loadCategories();
    this.themeService.loadTheme();
  }
}
