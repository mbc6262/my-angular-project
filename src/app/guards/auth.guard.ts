import { inject } from '@angular/core';
import { Router, CanActivateFn, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. אם המשתמש מחובר - תן לו להיכנס
  if (authService.checkIsAuthenticated()) {
    return true;
  }

  // 2. עצירת הלופ: אם המשתמש כבר נמצא בדף ההתחברות - תן לו להישאר שם
  if (state.url === '/login' || state.url === '/register') {
    return true;
  }

  // 3. רק אם הוא מנסה להיכנס למקום אחר - תשלח אותו להתחבר
  router.navigate(['/login']);
  return false;
};