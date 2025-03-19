import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem, MatListItemIcon, MatListItemTitle } from '@angular/material/list';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UsersService } from './users.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-users',
  providers: [UsersService],
  imports: [
    NgIf,
    NgFor,
    MatProgressBar,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    MatSuffix,
    MatIcon,
    MatButton,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
  ],
  template: `
    <mat-progress-bar *ngIf="isLoading" mode="query" />

    <main>
      <mat-form-field class="field" appearance="outline">
        <mat-label>Users Search</mat-label>
        <input matInput (input)="handleInput($event)" [value]="query" placeholder="Search...">
        <button *ngIf="query" matSuffix mat-icon-button aria-label="Clear" (click)="clearQuery()">
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>

      <section class="actions">
        <button mat-flat-button (click)="reload()">Reload</button>
        <button mat-flat-button (click)="addUser()">Add User</button>
        <button mat-flat-button (click)="clear()">Clear</button>
      </section>

      <mat-list>
        <ng-container *ngIf="users.length; else empty">
          <mat-list-item *ngFor="let user of users; trackBy: trackByFn">
            <mat-icon matListItemIcon>person</mat-icon>
            <div matListItemTitle>{{user.name}}</div>
          </mat-list-item>
        </ng-container>
        <ng-template #empty>
          <div matListItemTitle>Nothing to show</div>
        </ng-template>
      </mat-list>
    </main>
  `,
  styles: `
    main   { padding: 16px; }
    button { margin-right: 8px; }
    .field  { width: 100%; }
    .actions { margin-bottom: 16px; }
  `,
})
export class UsersComponent implements OnInit {
  query: string = '';
  users: User[] = [];
  isLoading: boolean = false;
  trackByFn = (index: number) => index;

  constructor(
    private usersService: UsersService,
    private snackbar: MatSnackBar,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.getUsers(this.query);
  }

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.query = target.value;
    this.getUsers(this.query);
  }

  clearQuery(): void {
    this.query = '';
    this.getUsers(this.query);
  }

  reload() {
    this.getUsers(this.query);
  }

  addUser() {
    const user = { id: 123, name: 'John Doe' };
    this.users = [user, ...this.users];
  }

  clear() {
    this.users = [];
  }

  private getUsers(query: string): void {
    this.isLoading = true;
    this.usersService.getUsers(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: users => this.users = users,
        error: () => this.snackbar.open('Couldn\'t fetch data...', 'Close'),
        complete: () => this.isLoading = false,
      });
  }
}
