import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { User } from '../models/user.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth';
  http = inject(HttpClient);
  notificationService = inject(NotificationService);
  router = inject(Router);
  isLoggedIn = signal<boolean>(false);
  isInitialized = signal<boolean>(false);
  loading = signal(false);
  user = signal<User | null>(null);

  signup(email: string, password: string) {
    this.loading.set(true);
    const toastId = this.notificationService.pending('Signing up user...');
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
          this.router.navigate(['/']);
        }),
        catchError((err) => {
          this.notificationService.error('Registration failed. Please try again.');
          return throwError(() => err);
        }),
        finalize(() => {
          this.loading.set(false);
          this.notificationService.clear(toastId);
        })
      );
  }

  login(email: string, password: string) {
    this.loading.set(true);
    const toastId = this.notificationService.pending('Logging in user...');
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
          this.router.navigate(['/']);
        }),
        catchError(err => {
          this.notificationService.error('Login failed. Please try again.');
          return throwError(() => err);
        }),
        finalize(() => {
          this.loading.set(false);
          this.notificationService.clear(toastId);
        }),
      );
  }

  forceLogout() {
    this.isLoggedIn.set(false);
    this.user.set(null);
    this.notificationService.warning('Refresh token has expired. Please log in again.', 'Session expired')
  }

  logout() {
    const toastId = this.notificationService.pending('Logging out user...')
    return this.http.delete(this.baseUrl + '/logout', { withCredentials: true }).pipe(
      tap(() => {
        this.isLoggedIn.set(false);
        this.user.set(null);
        this.router.navigate(['/'])
        this.notificationService.success('Logout successful');
      }),
      catchError(err => {
        this.notificationService.error('Logout failed. Please try again.');
        return throwError(() => err);
      }),
      finalize(() => {
        this.notificationService.clear(toastId)
      })
    );
  }
}
