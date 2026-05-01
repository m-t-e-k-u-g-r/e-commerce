import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, finalize, take, throwError } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<boolean>(false);

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 || err.status === 403) {
        if (req.url.includes('/auth/refresh')) {
          authService.forceLogout();
          return throwError(() => err);
        }

        if (!isRefreshing) {
          isRefreshing = true
          refreshTokenSubject.next(false);

          return authService.refresh().pipe(
            switchMap(() => {
              refreshTokenSubject.next(true);
              return next(req);
            }),
            catchError((refreshErr) => {
              authService.forceLogout();
              return throwError(() => refreshErr);
            }),
            finalize(() => {
              isRefreshing = false;
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter( success => success),
            take(1),
            switchMap(() => next(req))
          );
        }
      }
      return throwError(() => err);
    })
  );
};
