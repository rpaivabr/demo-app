import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem, MatListItemIcon, MatListItemTitle } from '@angular/material/list';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UsersService } from './users.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users',
  providers: [UsersService],
  imports: [
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
    @if (isLoading()) {
      <mat-progress-bar mode="query" />
    }

    <main>
      <mat-form-field class="field" appearance="outline">
        <mat-label>Users Search</mat-label>
        <input matInput (input)="handleInput($event)" [value]="query()" placeholder="Search...">
        @if (query()) {
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
        @for (user of users(); track $index) {
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
  private destroyRef = inject(DestroyRef);

  query = signal<string>('');
  users = signal<User[]>([]);
  isLoading = signal<boolean>(false);

  getUsersEffect = effect(() => {
    this.getUsers();
  });

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.query.set(target.value);
  }

  clearQuery(): void {
    this.reload();
  }

  reload() {
    this.getUsers();
  }

  addUser() {
    const user = { id: 123, name: 'John Doe' };
    this.users.update(users => [user, ...users]);
  }

  clear() {
    this.users.set([]);
  }

  private getUsers(): void {
    this.users.set([]);
    this.isLoading.set(true);
    this.usersService.getUsers(this.query()).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: users => this.users.set(users),
      error: () => this.snackbar.open('Couldn\'t fetch data...', 'Close'),
      complete: () => this.isLoading.set(false),
    });
  }
}
