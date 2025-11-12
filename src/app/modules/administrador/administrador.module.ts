import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Agregar esto

import { GestionPersonalComponent } from './gestion-personal/gestion-personal.component';
import { ReportesComponent } from './reportes/reportes.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
  ]
})
export class AdministradorModule { }
