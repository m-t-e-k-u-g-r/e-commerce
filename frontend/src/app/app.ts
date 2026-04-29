import { Component, inject, effect, untracked, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { AddressService } from './services/address.service';
import { OrderService } from './services/order.service';

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
  addressService = inject(AddressService);
  orderService = inject(OrderService);

  constructor() {
    effect(() => {
      const loggedIn = this.authService.isLoggedIn();

      untracked(() => {
        if (loggedIn) {
          this.addressService.getAddresses();
          this.orderService.getOrders();
        }
        this.cartService.getCartItems();
      });
    });
  }

  ngOnInit() {
    this.authService.getUser().subscribe();

    this.productService.getProducts();
    this.categoryService.getCategories();
  }
}
