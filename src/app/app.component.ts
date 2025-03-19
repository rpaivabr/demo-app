import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Theme, ThemeService } from './shared/theme.service';
import { HeaderComponent } from './shared/header.component';
import { Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, RouterOutlet, HeaderComponent],
  template: `
    <app-header [theme]="(theme$ | async)!" (toggle)="toggleTheme()" />
    <router-outlet />
  `,
})
export class AppComponent {
  private themeService = inject(ThemeService);
  theme$: Observable<Theme> = this.themeService.currentTheme;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}