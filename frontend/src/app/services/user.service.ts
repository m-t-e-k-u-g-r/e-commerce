import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user.type';
import { finalize, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl + 'users';
  http = inject(HttpClient);
  authService = inject(AuthService);

  getUser() {
    return this.http.get<User>(this.baseUrl + '/me',
      { withCredentials: true }
    ).pipe(
      tap((user: User) => {
        this.authService.user.set(user);
        this.authService.isLoggedIn.set(true);
      }),
      finalize(() => {
        this.authService.setInitialized(true);
      })
    );
  }
}
