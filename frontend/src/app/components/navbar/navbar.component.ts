import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  template: `
    <nav>
      <a href="/">
        <i class="fas fa-leaf"></i>
      </a>
      <div class="cart_info">
        <a href="/shopping-cart">
          <i class="fa fa-shopping-cart"></i>
        </a>
        <p>{{ this.cartService.totalItems() }}</p>
      </div>
      <div class="user_info">
        @if (!this.authService.isLoggedIn()) {
          <a href="/login">Log in</a>
        }
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
}
