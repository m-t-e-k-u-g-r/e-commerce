import { Component, computed, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { ThemeService } from '../../services/theme.service';
import { MatIconButton } from '@angular/material/button';

export type MenuItem = {
  label: string;
  action: () => void;
};

@Component({
  selector: 'app-navbar',
  imports: [MatIcon, MatBadge, MatIconButton],
  template: `
    <nav>
      <a href="/" title="Home">
        <i class="fas fa-leaf"></i>
      </a>
      <a
        href="/shopping-cart"
        matBadge="{{ badgeValue() }}"
        matBadgePosition="below"
        title="Shopping cart"
      >
        <mat-icon>shopping_cart</mat-icon>
      </a>
      <div class="user_info">
        @if (!this.authService.isLoggedIn()) {
          <a href="/login">Log in</a>
        } @else {
          <div class="user_info" title="Open menu">
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
      <button
        matIconButton
        (click)="this.themeService.toggleTheme()"
        title="Toggle theme"
      >
        @if (this.themeService.theme() == 'light') {
          <mat-icon>dark_mode</mat-icon>
        } @else {
          <mat-icon>light_mode</mat-icon>
        }
      </button>
    </nav>
  `,
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  router = inject(Router);
  cartService = inject(CartService);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  menuOpen = signal<Boolean>(false);
  badgeValue = computed(() => {
    const number = this.cartService.totalItems();
    if (number >= 100) return '99+';
    return number.toString();
  });

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
