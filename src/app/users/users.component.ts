import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem, MatListItemIcon, MatListItemTitle } from '@angular/material/list';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UsersService } from './users.service';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-users',
  providers: [UsersService],
  imports: [
    AsyncPipe,
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
    @if (isLoading) {
      <mat-progress-bar mode="query" />
    }

    <main>
      <mat-form-field class="field" appearance="outline">
        <mat-label>Users Search</mat-label>
        <input matInput (input)="handleInput($event)" [value]="query" placeholder="Search...">
        @if (query) {
          <button matSuffix mat-icon-button aria-label="Clear" (click)="clearQuery()">
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>

      <section class="actions">
        <button mat-flat-button (click)="reload()">Reload</button>
        <button mat-flat-button (click)="addUser()">Add User</button>
        <button mat-flat-button (click)="clear()">Clear</button>
      </section>

      <mat-list>
        @for (user of users$ | async; track $index) {
          <mat-list-item>
            <mat-icon matListItemIcon>person</mat-icon>
            <div matListItemTitle>{{user.name}}</div>
          </mat-list-item>
        } @empty {
          <div matListItemTitle>Nothing to show</div>
        }
      </mat-list>
    </main>
  `,
  styles: `
    main   { padding: 16px; }
    button { margin-right: 8px; }
    .field  { width: 100%; }
    .actions { margin-bottom: 16px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  private usersService = inject(UsersService);
  private snackbar = inject(MatSnackBar);

  query: string = '';
  users$: Observable<User[]> = this.getUsers(this.query);
  users: User[] = [];
  isLoading: boolean = false;

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.query = target.value;
    this.users$ = this.getUsers(this.query);
  }

  clearQuery(): void {
    this.query = '';
    this.users$ = this.getUsers(this.query);
  }

  reload() {
    this.users$ = this.getUsers(this.query);
  }

  addUser() {
    const user = { id: 123, name: 'John Doe' };
    this.users = [user, ...this.users];
    this.users$ = of(this.users);
  }

  clear() {
    this.users$ = of([]);
  }

  private getUsers(query: string): Observable<User[]> {
    this.isLoading = true;
    return this.usersService.getUsers(query).pipe(
      tap(users => this.users = users),
      catchError(() => {
        this.snackbar.open('Couldn\'t fetch data...', 'Close');
        return [];
      }),
      finalize(() => this.isLoading = false),
    );
  }
}
