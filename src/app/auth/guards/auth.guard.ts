import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Route Guard for protecting authenticated routes
 * Redirects unauthenticated users to the access login page
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getIsAuthenticated()) {
    return true;
  }

  // Redirect to login page
  router.navigate(['/access-login']);
  return false;
};
