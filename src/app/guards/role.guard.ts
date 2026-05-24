import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];
  const currentUser = authService.currentUser();

  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    if (requiredRoles.includes(currentUser.role)) {
      return true;
    } else {
      router.navigate(['/unauthorized']);
      return false;
    }
  }

  return true;
};
