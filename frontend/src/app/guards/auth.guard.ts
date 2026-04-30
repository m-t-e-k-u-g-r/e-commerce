import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.getUser().pipe(
    take(1),
    map(user => {
      return user ? true : router.createUrlTree(['/login']);
    }),
  );
};

export function isAuthError(err: any): boolean {
  return err.status === 401 || err.status === 403;
}

export const redirectFromLogin: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.getUser().pipe(
    take(1),
    map(user => {
      return user ? router.createUrlTree(['/']) : true;
    }),
  );
}
