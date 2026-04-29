import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.getUser().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};

export const redirectFromLogin: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.getUser().pipe(
    map(() => router.createUrlTree(['/'])),
    catchError(() => of(true))
  );
}
