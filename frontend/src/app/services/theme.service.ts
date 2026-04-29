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
    localStorage.setItem('theme', theme);
    this.theme.set(theme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      this.setTheme(savedTheme as Theme);
    }
  }
}
