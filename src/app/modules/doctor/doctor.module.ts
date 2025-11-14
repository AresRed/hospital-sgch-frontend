import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AgendaComponent } from './agenda/agenda.component';
import { ExpedienteComponent } from './expediente/expediente.component';

const routes: Routes = [
  
  { path: 'agenda', component: AgendaComponent },
  { path: 'expediente/:id', component: ExpedienteComponent },
  { path: '', redirectTo: 'agenda', pathMatch: 'full' }
];
