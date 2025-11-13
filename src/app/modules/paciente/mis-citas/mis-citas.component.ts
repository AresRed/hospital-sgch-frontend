import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';

interface Cita {
  id: number;
  doctor: string;
  especialidad: string;
  fecha: Date;
  hora: string;
  estado: string;
  motivo: string;
}

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './mis-citas.component.html',
  styleUrl: './mis-citas.component.scss'
})
export class MisCitasComponent implements OnInit {
  citas: Cita[] = [];
  filtroEstado: string = 'todas';

  constructor() {}

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.citas = [
      {
        id: 1,
        doctor: 'Dr. Juan Pérez',
        especialidad: 'Cardiología',
        fecha: new Date('2024-01-20'),
        hora: '09:00',
        estado: 'confirmada',
        motivo: 'Consulta de rutina'
      },
      {
        id: 2,
        doctor: 'Dra. Ana López',
        especialidad: 'Pediatría',
        fecha: new Date('2024-01-18'),
        hora: '14:30',
        estado: 'completada',
        motivo: 'Control anual'
      },
      {
        id: 3,
        doctor: 'Dr. Carlos Ruiz',
        especialidad: 'Medicina General',
        fecha: new Date('2024-01-25'),
        hora: '11:00',
        estado: 'pendiente',
        motivo: 'Dolor de cabeza persistente'
      }
    ];
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

  getCitasFiltradas() {
    if (this.filtroEstado === 'todas') {
      return this.citas;
    }
    return this.citas.filter(cita => cita.estado === this.filtroEstado);
  }

  // Agrega estos métodos a tu clase MisCitasComponent

getCitasCountByEstado(estado: string): number {
  return this.citas.filter(cita => cita.estado === estado).length;
}

getProximaCita(): Cita | null {
  const ahora = new Date();
  const citasFuturas = this.citas
    .filter(cita => new Date(cita.fecha) > ahora && cita.estado !== 'cancelada' && cita.estado !== 'completada')
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  
  return citasFuturas.length > 0 ? citasFuturas[0] : null;
}

  cancelarCita(cita: Cita) {
    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      cita.estado = 'cancelada';
      console.log('Cita cancelada:', cita);
    }
  }

  reprogramarCita(cita: Cita) {
    console.log('Reprogramar cita:', cita);
    // Lógica para reprogramar cita
  }
}