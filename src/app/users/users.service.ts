import { computed, effect, inject, Injectable, ResourceStatus, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';

const API_URL = `https://jsonplaceholder.typicode.com/users`;

export type User = {
  id: number;
  name: string;
}

@Injectable()
export class UsersService {
  private http = inject(HttpClient);
  query = signal<string>('');
  private usersResource = rxResource<User[], { query: string }>({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => this.http.get<User[]>(`${API_URL}?name_like=^${request.query}`),
    defaultValue: [],
  });
  // private usersResource = httpResource<User[]>(() => `${API_URL}?name_like=^${this.query()}`, { defaultValue: [] });
  users = this.usersResource.value;
  isLoading = this.usersResource.isLoading;
  error = this.usersResource.error;
  status = computed(() => ResourceStatus[this.usersResource.status()]);
  reload = () => this.usersResource.reload();

  statusEffect = effect(() => {
    console.log(this.status());
  });
}
