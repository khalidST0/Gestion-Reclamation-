import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // Verify this relative path matches your folder layout

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If a valid JWT string is found in storage, allow access
  if (authService.getToken()) {
    return true;
  }

  // Otherwise, block access and kick the user back to login
  router.navigate(['/login']);
  return false;
};
