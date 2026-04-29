import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { User } from '../models/user.type';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth';
  http = inject(HttpClient);
  notificationService = inject(NotificationService);
  router = inject(Router);
  isLoggedIn = signal<boolean>(false);
  userEmail = signal<string | null>(null);

  getUser() {
    return this.http.get<User>(this.baseUrl + '/me', { withCredentials: true }).pipe(
      tap((user: User) => {
        this.userEmail.set(user.email);
        this.isLoggedIn.set(true);
      }),
      catchError(() => {
        return this.refresh().pipe(
          catchError(() => {
            this.isLoggedIn.set(false);
            return of(null);
          }),
        );
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
        catchError(() => {
          this.notificationService.error('Registration failed. Please try again.');
          return of(null);
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
        catchError(() => {
          this.notificationService.error('Login failed. Please try again.');
          return of(null);
        }),
      );
  }

  refresh() {
    return this.http.post(this.baseUrl + '/refresh', {}, { withCredentials: true }).pipe(
      tap(() => {
        this.isLoggedIn.set(true);
      }),
      catchError(() => {
        this.isLoggedIn.set(false);
        return of(null);
      }),
    );
  }

  logout() {
    return this.http.delete(this.baseUrl + '/logout', { withCredentials: true }).pipe(
      tap(() => {
        this.isLoggedIn.set(false);
        this.userEmail.set(null);
        this.router.navigate(['/'])
        this.notificationService.success('Logout successful');
      }),
      catchError(() => {
        this.notificationService.error('Logout failed. Please try again.');
        return of(null);
      }),
    );
  }
}
