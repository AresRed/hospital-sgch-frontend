import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./modules/auth/auth/auth.component').then(m => m.AuthComponent)
  },
  
  // Rutas directas (sin layout)
  {
    path: 'admin/gestion-personal',
    loadComponent: () => import('./modules/administrador/gestion-personal/gestion-personal.component').then(m => m.GestionPersonalComponent)
  },
  {
    path: 'admin/reportes',
    loadComponent: () => import('./modules/administrador/reportes/reportes.component').then(m => m.ReportesComponent)
  },
  {
    path: 'doctor/agenda',
    loadComponent: () => import('./modules/doctor/agenda/agenda.component').then(m => m.AgendaComponent)
  },
  {
    path: 'doctor/expediente',
    loadComponent: () => import('./modules/doctor/expediente/expediente.component').then(m => m.ExpedienteComponent)
  },
  {
    path: 'paciente/agendar-cita',
    loadComponent: () => import('./modules/paciente/agendar-cita/agendar-cita.component').then(m => m.AgendarCitaComponent)
  },
  {
    path: 'paciente/mis-citas',
    loadComponent: () => import('./modules/paciente/mis-citas/mis-citas.component').then(m => m.MisCitasComponent)
  },
  
  // Redirecciones
  { path: 'admin', redirectTo: 'admin/gestion-personal', pathMatch: 'full' },
  { path: 'doctor', redirectTo: 'doctor/agenda', pathMatch: 'full' },
  { path: 'paciente', redirectTo: 'paciente/mis-citas', pathMatch: 'full' },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' }
];