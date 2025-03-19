import { Component, inject, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Theme, ThemeService } from './shared/theme.service';
import { HeaderComponent } from './shared/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header [theme]="theme()" (toggle)="toggleTheme()" />
    <router-outlet />
  `,
})
export class AppComponent {
  private themeService = inject(ThemeService);
  theme: Signal<Theme> = this.themeService.currentTheme;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}