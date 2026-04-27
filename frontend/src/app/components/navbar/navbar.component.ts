import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';

export type MenuItem = {
  label: string;
  action: () => void;
};

@Component({
  selector: 'app-navbar',
  imports: [MatIcon, MatBadge],
  template: `
    <nav>
      <a href="/">
        <i class="fas fa-leaf"></i>
      </a>
      <a
        href="/shopping-cart"
        matBadge="{{ this.cartService.totalItems() }}"
        matBadgePosition="below"
      >
        <mat-icon>shopping_cart</mat-icon>
      </a>
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
  router = inject(Router);
  cartService = inject(CartService);
  authService = inject(AuthService);
  menuOpen = signal<Boolean>(false);

  onItemClick(item: MenuItem) {
    item.action();
  }

  toggle() {
    this.menuOpen.update((value) => !value);
  }

  menuItems: MenuItem[] = [
    {
      label: 'My orders',
      action: () => {
        this.router.navigate(['/orders']);
        this.menuOpen.set(false);
      },
    },
    {
      label: 'My addresses',
      action: () => {
        this.router.navigate(['/address']);
        this.menuOpen.set(false);
      },
    },
    {
      label: 'Logout',
      action: () => {
        this.authService.logout().subscribe();
        this.menuOpen.set(false);
      },
    },
  ];
}
