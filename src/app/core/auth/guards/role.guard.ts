import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MessageService } from '../../services/message.service'; // Importar nuestro MessageService

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService); // Inyectar MessageService aquí

  const userInfo = authService.getUserInfo();
  const expectedRoles = route.data['roles'] as string[];
  const userRole = userInfo?.rol?.toUpperCase(); // Normalizar el rol del usuario a mayúsculas, manejar null/undefined

  console.log(`RoleGuard DEBUG: Ruta: ${state.url}`);
  console.log(`RoleGuard DEBUG: UserInfo:`, userInfo);
  console.log(`RoleGuard DEBUG: Rol del usuario (normalizado): '${userRole}'`);
  console.log(`RoleGuard DEBUG: Roles esperados para la ruta:`, expectedRoles);

  if (!userInfo || !userRole) { // Usar userRole normalizado para la verificación inicial
    console.log('RoleGuard DEBUG: No hay UserInfo o rol válido, redirigiendo a /auth');
    return router.createUrlTree(['/auth']); // Redirigir a la página de login si no hay info de usuario o rol
  }


  if (expectedRoles && expectedRoles.includes(userRole)) {
    console.log('RoleGuard DEBUG: Acceso permitido.');
    return true;
  } else {
    console.log('RoleGuard DEBUG: Acceso denegado, redirigiendo a /auth');
    messageService.showError('Acceso Denegado', 'No tiene los permisos necesarios para acceder a esta sección.');
    return router.createUrlTree(['/auth']); // Redirigir a la página de login
  }
};
