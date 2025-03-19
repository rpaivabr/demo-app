import { Component, computed, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { Theme } from './theme.service';

const themeIcons = ['light_mode', 'dark_mode'] as const;
export type ThemeIcon = typeof themeIcons[number];

@Component({
  selector: 'app-header',
  imports: [MatIconButton, MatIcon, MatToolbar],
  template: `
    <header>
      <mat-toolbar>
      <span>Demo App</span>
      <span class="spacer"></span>
      <button (click)="handleClick()" mat-icon-button aria-label="Toggle theme icon-button with light/dark icon">
        <mat-icon>{{ themeIcon() }}</mat-icon>
      </button>
    </mat-toolbar>
    </header>
  `,
  styles: `
    .spacer  { flex: 1 }
  `,
})
export class HeaderComponent {
  theme = input<Theme>('light');
  toggle = output<void>();
  themeIcon = computed(() => (this.theme() === 'light' ? 'light_mode' : 'dark_mode'));

  handleClick(): void {
    this.toggle.emit();
  }
}
