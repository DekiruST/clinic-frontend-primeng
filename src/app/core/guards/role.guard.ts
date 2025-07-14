// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function roleGuard(expectedRole: string): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const user = auth.getUserData();
    if (user?.rol === expectedRole) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  };
}
