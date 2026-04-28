import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY, tap, throwError } from 'rxjs';
import { User } from '../models/user.type';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth';
  http = inject(HttpClient);
  notificationService = inject(NotificationService);
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
          return EMPTY;
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
          this.notificationService.success('Registration successful');
        }),
        catchError((err) => {
          this.notificationService.error('Registration failed. Please try again.');
          return EMPTY;
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
          this.notificationService.success('Login successful');
        }),
        catchError((err) => {
          this.notificationService.error('Login failed. Please try again.');
          return EMPTY;
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
              break;
            default:
              break;
          }
          this.isLoggedIn.set(false);
          return EMPTY;
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
          this.notificationService.success('Logout successful');
        }),
        catchError((err) => {
          this.notificationService.error('Logout failed. Please try again.');
          return EMPTY;
        }),
      );
  }
}
