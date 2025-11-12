import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';
import { AuthComponent } from './modules/auth/auth/auth.component';
export const routes: Routes = [{
    path: 'auth',
    loadComponent: () => import('./modules/auth/auth/auth.component').then(m => m.AuthComponent)
  },
  
  // Rutas Protegidas por Rol
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] }, // Rol requerido para esta ruta
    loadComponent: () => import('./modules/administrador/reportes/reportes.component').then(m => m.ReportesComponent)
  },
  {
    path: 'doctor',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DOCTOR', 'ADMINISTRADOR'] }, // Roles múltiples permitidos
    loadComponent: () => import('./modules/doctor/agenda/agenda.component').then(m => m.AgendaComponent)
  },
  {
    path: 'paciente',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PACIENTE'] },
    loadComponent: () => import('./modules/paciente/agendar-cita/agendar-cita.component').then(m => m.AgendarCitaComponent)
  },
  
  // Redirección por defecto
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  // Ruta de fallback (404 o acceso denegado)
  { path: '**', redirectTo: 'auth' }];
