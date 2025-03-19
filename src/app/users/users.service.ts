import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = `https://jsonplaceholder.typicode.com/users`;

export type User = {
  id: number;
  name: string;
}

@Injectable()
export class UsersService {
  private httpClient = inject(HttpClient);

  getUsers(query: string = ''): Observable<User[]> {
    return this.httpClient.get<User[]>(`${API_URL}?name_like=^${query}`);
  }
}
