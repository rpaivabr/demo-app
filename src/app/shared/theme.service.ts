import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

const themes = ['light', 'dark'] as const;
export type Theme = typeof themes[number];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject<Document>(DOCUMENT);
  private currentThemeState = new BehaviorSubject<Theme>('light');
  currentTheme: Observable<Theme> = this.currentThemeState.asObservable();

  constructor() {
    this.setTheme(this.getThemeFromLocalStorage());
  }

  toggleTheme(): void {
    if (this.currentThemeState.value === 'light') {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  }

  setTheme(theme: Theme): void {
    this.currentThemeState.next(theme);
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
