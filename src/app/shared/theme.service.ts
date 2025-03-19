import { inject, Injectable, Signal, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const themes = ['light', 'dark'] as const;
export type Theme = typeof themes[number];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject<Document>(DOCUMENT);
  private currentThemeState = signal<Theme>('light');
  currentTheme: Signal<Theme> = this.currentThemeState.asReadonly();

  constructor() {
    this.setTheme(this.getThemeFromLocalStorage());
  }

  toggleTheme(): void {
    if (this.currentThemeState() === 'light') {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  }

  setTheme(theme: Theme): void {
    this.currentThemeState.set(theme);
    if (theme === 'dark') {
      this.document.documentElement.classList.add('dark-mode');
    } else {
      this.document.documentElement.classList.remove('dark-mode');
    }
    this.setThemeInLocalStorage(theme);
  }

  private setThemeInLocalStorage(theme: Theme): void {
    localStorage.setItem('preferred-theme', theme);
  }

  private getThemeFromLocalStorage(): Theme {
    return localStorage.getItem('preferred-theme') as Theme || 'light';
  }
}
