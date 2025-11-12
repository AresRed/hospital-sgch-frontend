import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userInfo = authService.getUserInfo();


  if (!userInfo || !userInfo.rol) {
    return router.createUrlTree(['/auth/login']);
  }


  const expectedRoles = route.data['roles'] as string[];


  if (expectedRoles && expectedRoles.includes(userInfo.rol)) {
    return true;
  } else {

    alert('Acceso Denegado. No tiene los permisos necesarios.');
    return router.createUrlTree(['/']);
  }
};