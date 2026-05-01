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
import { filter, switchMap } from 'rxjs/operators';

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
    this.authService.isInitialized$
      .pipe(
        filter(Boolean),
        take(1),
        filter(() => this.authService.isLoggedIn()),
        switchMap(() => this.orderService.getOrders())
      )
      .subscribe();
  }

  ngOnInit() {
    this.userService.getUser().subscribe();

    this.productService.getProducts();
    this.categoryService.getCategories();
    this.cartService.getCartItems();
    this.themeService.loadTheme();
    this.addressService.getAddresses();
  }
}
