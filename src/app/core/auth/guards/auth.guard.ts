import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  console.log(`AuthGuard DEBUG: Ruta: ${state.url}, Autenticado: ${isAuthenticated}`);

  if (isAuthenticated) {
    return true;
  } else {
    console.log('AuthGuard DEBUG: No autenticado, redirigiendo a /auth');
    router.navigate(['/auth']); // Redirigir a la página de login si no está autenticado
    return false;
  }
};
