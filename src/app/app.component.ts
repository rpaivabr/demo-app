import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Theme, ThemeService } from './shared/theme.service';
import { HeaderComponent } from './shared/header.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header [theme]="theme" (toggle)="toggleTheme()" />
    <router-outlet />
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  theme: Theme = 'light';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.subscription = this.themeService.currentTheme
      .subscribe(theme => this.theme = theme);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}