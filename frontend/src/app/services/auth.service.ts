import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { User } from '../models/user.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth';
  http = inject(HttpClient);
  isLoggedIn = signal<boolean>(false);
  userEmail = signal<string | null>(null);

  getUser() {
    return this.http
      .get<User>(
        this.baseUrl + '/me',
        { withCredentials: true }
      ).pipe(
        tap((user: User) => {
          this.userEmail.set(user.email);
          this.isLoggedIn.set(true);
        }),
        catchError((err) => {
          this.refresh().subscribe();
          return throwError(() => err);
        }),
      );
  }

  signup(email: string, password: string) {
    return this.http
      .post(
        this.baseUrl + '/register',
        { email: email, password: password },
        { observe: 'response', withCredentials: true },
      )
      .pipe(
        tap(() => {
          this.isLoggedIn.set(true);
        }),
        catchError((err) => {
          console.error('Failed to signup user:', err);
          return throwError(() => err);
        }),
      );
  }

  login(email: string, password: string) {
    return this.http
      .post(
        this.baseUrl + '/login',
        { email: email, password: password },
        {
          observe: 'response',
          withCredentials: true,
        },
      )
      .pipe(
        tap(() => {
          this.isLoggedIn.set(true);
        }),
        catchError((err) => {
          console.error('Failed to log in user:', err);
          return throwError(() => err);
        }),
      );
  }

  refresh() {
    return this.http
      .post(this.baseUrl + '/refresh', {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.isLoggedIn.set(true);
        }),
        catchError((err) => {
          switch (err.status) {
            case 401:
              console.error('Refresh called without a token (frontend bug)', err);
              break;
            case 403:
              this.isLoggedIn.set(false);
              break;
            default:
              console.error('Failed to refresh token:', err);
          }
          return throwError(() => err);
        }),
      );
  }

  logout() {
    return this.http
      .delete(
        this.baseUrl + '/logout',
        { withCredentials: true }
      ).pipe(
        tap(() => {
          this.isLoggedIn.set(false);
          this.userEmail.set(null);
        }),
        catchError((err) => {
          console.error('Failed to logout:', err);
          return throwError(() => err);
        }),
      );
  }
}
