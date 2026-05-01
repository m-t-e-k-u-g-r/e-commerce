import { Component, computed, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { ThemeService } from '../../services/theme.service';
import { MatIconButton } from '@angular/material/button';
import { OrderService } from '../../services/order.service';

type Visibility = 'user' | 'guest' | 'all'
export type MenuItem = {
  icon?: string;
  label: string;
  action: () => void;
  visibleFor: Visibility;
};

@Component({
  selector: 'app-navbar',
  imports: [MatIcon, MatBadge, MatIconButton],
  template: `
    <nav>
      <div class="nav-left">
        <a href="/" title="Home">
          <i class="fas fa-leaf"></i>
        </a>
      </div>
      <div class="nav-right">
        <a
          href="/shopping-cart"
          matBadge="{{ badgeValue() }}"
          matBadgePosition="below"
          title="Shopping cart"
        >
          <mat-icon>shopping_cart</mat-icon>
        </a>
        <div class="user_info">
          <button matIconButton (click)="toggle()">
            <mat-icon>
              {{ this.authService.isLoggedIn() ? 'account_circle' : 'no_accounts' }}
            </mat-icon>
          </button>
          @if (this.menuOpen()) {
            <ul class="info_menu">
              @for (item of this.getVisibleItems(); track item.label) {
                <li (click)="onItemClick(item)">
                  @if (item.icon) {
                    <mat-icon>{{ item.icon }}</mat-icon>
                  }
                  {{ item.label }}
                </li>
              }
            </ul>
          }
        </div>
        <button matIconButton (click)="this.themeService.toggleTheme()" title="Toggle theme">
          @if (this.themeService.theme() == 'light') {
            <mat-icon>dark_mode</mat-icon>
          } @else {
            <mat-icon>light_mode</mat-icon>
          }
        </button>
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  router = inject(Router);
  cartService = inject(CartService);
  authService = inject(AuthService);
  orderService = inject(OrderService);
  themeService = inject(ThemeService);
  menuOpen = signal<Boolean>(false);
  badgeValue = computed(() => {
    const number = this.cartService.totalItems();
    if (number >= 100) return '99+';
    return number.toString();
  });
  getVisibleItems(): MenuItem[] {
    const loggedIn = this.authService.isLoggedIn();

    return this.menuItems.filter(
      (item) =>
        item.visibleFor === 'all' ||
        (loggedIn && item.visibleFor === 'user') ||
        (!loggedIn && item.visibleFor === 'guest'),
    );
  }

  onItemClick(item: MenuItem) {
    item.action();
    this.menuOpen.set(false);
  }

  toggle() {
    this.menuOpen.update((value) => !value);
  }

  menuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'person',
      action: () => this.router.navigate(['/profile']),
      visibleFor: 'user',
    },
    {
      label: 'My orders',
      icon: 'receipt_long',
      action: () => this.router.navigate(['/orders']),
      visibleFor: 'user',
    },
    {
      label: 'Check order',
      icon: 'receipt',
      action: () => this.orderService.checkGuestOrder(),
      visibleFor: 'guest',
    },
    {
      label: 'My addresses',
      icon: 'location_on',
      action: () => this.router.navigate(['/address']),
      visibleFor: 'all',
    },
    {
      label: 'Login',
      icon: 'login',
      action: () => this.router.navigate(['/login']),
      visibleFor: 'guest',
    },
    {
      label: 'Logout',
      icon: 'logout',
      action: () => this.authService.logout().subscribe(),
      visibleFor: 'user',
    },
  ];
}
