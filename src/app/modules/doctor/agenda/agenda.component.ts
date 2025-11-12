import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

interface Cita {
  id: number;
  paciente: string;
  fecha: Date;
  hora: string;
  tipo: string;
  estado: string;
}
@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss',
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class AgendaComponent implements OnInit {
  citas: Cita[] = [];
  fechaSeleccionada: Date = new Date();
  vista: 'dia' | 'semana' = 'dia';
  filtroEstado: string = 'todas';

  estados = [
    { value: 'todas', label: 'Todas las citas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'confirmada', label: 'Confirmadas' },
    { value: 'completada', label: 'Completadas' }
  ];

  constructor() {}

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.citas = [
      {
        id: 1,
        paciente: 'María García López',
        fecha: new Date(),
        hora: '09:00',
        tipo: 'Consulta General',
        estado: 'confirmada'
      },
      {
        id: 2,
        paciente: 'Carlos Rodríguez',
        fecha: new Date(),
        hora: '10:30',
        tipo: 'Seguimiento',
        estado: 'pendiente'
      },
      {
        id: 3,
        paciente: 'Ana Martínez',
        fecha: new Date(),
        hora: '14:00',
        tipo: 'Primera Vez',
        estado: 'confirmada'
      }
    ];
  }

  cambiarFecha(dias: number) {
    const nuevaFecha = new Date(this.fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    this.fechaSeleccionada = nuevaFecha;
    this.cargarCitas();
  }

  // AGREGAR ESTE MÉTODO
  establecerFechaHoy() {
    this.fechaSeleccionada = new Date();
    this.cargarCitas();
  }

  getEstadoBadgeClass(estado: string): string {
    switch(estado) {
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getBorderColor(estado: string): string {
    switch(estado) {
      case 'confirmada': return 'border-l-green-500';
      case 'pendiente': return 'border-l-yellow-500';
      case 'completada': return 'border-l-blue-500';
      case 'cancelada': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  }

  cambiarEstadoCita(cita: Cita, nuevoEstado: string) {
    cita.estado = nuevoEstado;
    console.log('Cambiando estado cita:', cita);
  }

  getCitasFiltradas() {
    if (this.filtroEstado === 'todas') {
      return this.citas;
    }
    return this.citas.filter(cita => cita.estado === this.filtroEstado);
  }
  
  getCitasCountByEstado(estado: string): number {
    return this.citas.filter(cita => cita.estado === estado).length;
  }
}