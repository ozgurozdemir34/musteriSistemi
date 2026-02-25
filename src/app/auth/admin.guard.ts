import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  // Admin her şeye girer
  if (auth.hasRole('Admin')) return true;

  // Admin değilse admin panel izni şart (istersen kaldır)
  return auth.hasPerm('admin.user.permissions');
};