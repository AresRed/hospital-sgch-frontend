import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { authGuard } from '../../core/auth/guards/auth.guard';
import { roleGuard } from '../../core/auth/guards/role.guard';
import { Routes } from '@angular/router';
import { AgendarCitaComponent } from './agendar-cita/agendar-cita.component';
import { MisCitasComponent } from './mis-citas/mis-citas.component';
import { PacienteDashboardComponent } from './paciente-dashboard/paciente-dashboard.component'; 
import { HistorialComponent } from './historial/historial.component';
import { PerfilComponent } from './perfil/perfil.component';


export const routes: Routes = [
  // Las rutas del paciente se definirán directamente en app.routes.ts
  // Este módulo ya no actuará como un layout contenedor.
];
