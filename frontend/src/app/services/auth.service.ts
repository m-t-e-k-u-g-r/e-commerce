import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpContext } from '@angular/common/http';
import { catchError, finalize, of, shareReplay, take, tap, throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { User } from '../models/user.type';
import { isAuthError } from '../guards/auth.guard';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs/operators';
import { API_TARGET } from '../interceptors/refresh-interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth';
  http = inject(HttpClient);
  notificationService = inject(NotificationService);
  router = inject(Router);
  isLoggedIn = signal<boolean>(false);
  private _isInitialized = signal<boolean>(false);
  readonly isInitialized$ = toObservable(this._isInitialized);
  readonly ready$ = this.isInitialized$.pipe(
    filter(Boolean),
    take(1),
    shareReplay(1)
  );
  loading = signal(false);
  user = signal<User | null>(null);

  signup(email: string, password: string) {
    this.loading.set(true);
    const toastId = this.notificationService.pending('Signing up user...');
    return this.http
      .post(
        this.baseUrl + '/register',
        { email: email, password: password },
        { observe: 'response',
          withCredentials: true,
          context: new HttpContext().set(API_TARGET, 'signup')
        },
      )
      .pipe(
        switchMap(() =>
          this.login(email, password)
        ),
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
          context: new HttpContext().set(API_TARGET, 'login'),
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
    const toastId = this.notificationService.pending('Logging out user...');
    return this.http
      .delete(this.baseUrl + '/logout', {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.isLoggedIn.set(false);
          this.user.set(null);
          this.router.navigate(['/']);
          this.notificationService.success('Logout successful');
        }),
        catchError((err) => {
          this.notificationService.error('Logout failed. Please try again.');
          return throwError(() => err);
        }),
        finalize(() => {
          this.notificationService.clear(toastId);
        }),
      );
  }

  refresh() {
    return this.http.post(this.baseUrl + '/refresh', {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.isLoggedIn.set(true);
      }),
      catchError((err) => {
        this.isLoggedIn.set(false);
        if (isAuthError(err)) {
          return of(null);
        }
        return throwError(() => err);
      }),
    );
  }

  setInitialized(value: boolean) {
    this._isInitialized.set(value);
  }
}
