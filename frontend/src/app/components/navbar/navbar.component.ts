import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

export type MenuItem = {
  label: string;
  action: () => void;
};

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
        } @else {
          <div class="user_info">
            <button (click)="toggle()" class="profile_button">
              {{ this.authService.userEmail() }}
            </button>
            @if (this.menuOpen()) {
              <ul class="info_menu">
                @for (item of this.menuItems; track item.label) {
                  <li (click)="onItemClick(item)">
                    {{ item.label }}
                  </li>
                }
              </ul>
            }
          </div>
        }
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  menuOpen = signal<Boolean>(false);

  onItemClick(item: MenuItem) {
    item.action();
  }

  toggle() {
    this.menuOpen.update(value => !value);
  }

  menuItems: MenuItem[] = [
    { label: 'Logout', action: () => {
      this.authService.logout().subscribe();
      this.menuOpen.set(false);
    }},
  ]
}
