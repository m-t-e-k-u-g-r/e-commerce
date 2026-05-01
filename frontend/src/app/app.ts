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
import { finalize, forkJoin, of, take } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadingService } from './services/loading.service';

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
  loadingService = inject(LoadingService)

  constructor() {
    this.loadingService.startLoading('user')
    this.authService.ready$
      .pipe(take(1))
      .subscribe(() => {
        forkJoin([
          this.orderService.loadOrders(),
          this.cartService.loadCartItems(),
          this.addressService.loadAddresses(),
        ]).pipe(
          finalize(() => this.loadingService.stopLoading('user'))
        ).subscribe();
      });
  }

  ngOnInit() {
    this.loadingService.startLoading('home');
    this.themeService.loadTheme();

    forkJoin([
      this.userService.getUser().pipe(catchError(() => of(null))),
      this.productService.loadProducts(),
      this.categoryService.loadCategories()
    ]).pipe(
      finalize(() => this.loadingService.stopLoading('home'))
    ).subscribe();
  }
}
