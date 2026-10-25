import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AdminAuthService } from './admin-auth.service';

export const adminAuthGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);

  return auth.checkSession().pipe(
    map(isAuthenticated => isAuthenticated
      ? true
      : router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: state.url } })
    ),
    catchError(() => of(router.createUrlTree(['/admin/login'], {
      queryParams: { reason: 'unavailable', returnUrl: state.url }
    })))
  );
};
