import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs/operators';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isInitialized$.pipe(
    filter(Boolean),
    take(1),
    map(() =>
      authService.isLoggedIn()
        ? true
        : router.createUrlTree(['/login'])
    )
  );
};

export function isAuthError(err: any): boolean {
  return err.status === 401 || err.status === 403;
}

export const redirectFromLogin: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isInitialized$.pipe(
    filter(Boolean),
    take(1),
    map(() =>
      authService.isLoggedIn()
        ? router.createUrlTree(['/'])
        : true
    ),
  );
}
