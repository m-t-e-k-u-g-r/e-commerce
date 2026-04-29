import { effect, Injectable, signal } from '@angular/core';
import { Theme } from '../models/theme.type';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = signal<Theme>('light');
  constructor() {
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.theme());
    });
  }
  private setTheme(theme: Theme) {
    this.theme.set(theme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }
}
