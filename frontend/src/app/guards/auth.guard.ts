import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = authService.isLoggedIn();
  return isLoggedIn ? true : router.createUrlTree(['/login']);
};

export function isAuthError(err: any): boolean {
  return err.status === 401 || err.status === 403;
}

export const redirectFromLogin: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = authService.isLoggedIn();
  return isLoggedIn ? router.createUrlTree(['/']) : true;
}
