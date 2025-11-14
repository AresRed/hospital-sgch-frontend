import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';
import { AgendarCitaComponent } from './modules/paciente/agendar-cita/agendar-cita.component';
export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./modules/auth/auth/auth.component').then(m => m.AuthComponent)
  },
  
  // Rutas del Paciente (con Header)
  {
    path: 'paciente',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PACIENTE'] },
    children: [
      { path: '', redirectTo: 'mis-citas', pathMatch: 'full' }, // Redirige a mis-citas por defecto
      { path: 'agendar', loadComponent: () => import('./modules/paciente/agendar-cita/agendar-cita.component').then(m => m.AgendarCitaComponent) },
      { path: 'agendar/:id', loadComponent: () => import('./modules/paciente/agendar-cita/agendar-cita.component').then(m => m.AgendarCitaComponent) }, // Ruta para reprogramar
      { path: 'mis-citas', loadComponent: () => import('./modules/paciente/mis-citas/mis-citas.component').then(m => m.MisCitasComponent) },
      { path: 'historial', loadComponent: () => import('./modules/paciente/historial/historial.component').then(m => m.HistorialComponent) },
      { path: 'perfil', loadComponent: () => import('./modules/paciente/perfil/perfil.component').then(m => m.PerfilComponent) },
    ]
  },

  // Rutas del Administrador (con Header)
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] },
    children: [
      { path: '', redirectTo: 'gestion-personal', pathMatch: 'full' },
      { path: 'gestion-personal', loadComponent: () => import('./modules/administrador/gestion-personal/gestion-personal.component').then(m => m.GestionPersonalComponent) },
      { path: 'reportes', loadComponent: () => import('./modules/administrador/reportes/reportes.component').then(m => m.ReportesComponent) },
    ]
  },

  // Rutas del Doctor (con Header)
  {
    path: 'doctor',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DOCTOR'] },
    children: [
      { path: '', redirectTo: 'agenda', pathMatch: 'full' },
      { path: 'agenda', loadComponent: () => import('./modules/doctor/agenda/agenda.component').then(m => m.AgendaComponent) },
      { path: 'expediente', loadComponent: () => import('./modules/doctor/expediente/expediente.component').then(m => m.ExpedienteComponent) },
    ]
  },
  
  // Redirecciones y ruta por defecto
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' }
];
