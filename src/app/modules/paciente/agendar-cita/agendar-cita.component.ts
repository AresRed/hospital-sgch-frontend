import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Doctor {
  id: number;
  nombre: string;
  especialidad: string;
  horarios: string[];
}

interface HorarioDisponible {
  fecha: string;
  hora: string;
  disponible: boolean;
}

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar-cita.component.html',
  styleUrls: ['./agendar-cita.component.scss']
})
export class AgendarCitaComponent implements OnInit {
  especialidades: string[] = ['Medicina General', 'Cardiología', 'Pediatría', 'Dermatología', 'Ginecología'];
  doctores: Doctor[] = [];
  horariosDisponibles: HorarioDisponible[] = [];
  
  citaData = {
    especialidad: '',
    doctorId: 0,
    fecha: '',
    hora: '',
    motivo: ''
  };

  pasoActual: number = 1;

  constructor() {}

  ngOnInit() {
    this.cargarDoctores();
  }

  cargarDoctores() {
    this.doctores = [
      { id: 1, nombre: 'Dr. Juan Pérez', especialidad: 'Cardiología', horarios: ['09:00', '10:00', '11:00'] },
      { id: 2, nombre: 'Dra. Ana López', especialidad: 'Pediatría', horarios: ['14:00', '15:00', '16:00'] },
      { id: 3, nombre: 'Dr. Carlos Ruiz', especialidad: 'Medicina General', horarios: ['08:00', '09:30', '11:00'] }
    ];
  }

  onEspecialidadChange() {
    this.citaData.doctorId = 0;
    this.citaData.fecha = '';
    this.citaData.hora = '';
  }

  onDoctorChange() {
    this.generarHorariosDisponibles();
  }

  generarHorariosDisponibles() {
    if (this.citaData.doctorId) {
      const doctor = this.doctores.find(d => d.id === this.citaData.doctorId);
      this.horariosDisponibles = doctor?.horarios.map(hora => ({
        fecha: new Date().toISOString().split('T')[0],
        hora: hora,
        disponible: Math.random() > 0.3 // Simular disponibilidad
      })) || [];
    }
  }

  getNombreDoctor(): string {
  const doctor = this.doctores.find(d => d.id === this.citaData.doctorId);
  return doctor ? doctor.nombre : 'No seleccionado';
}

  siguientePaso() {
    if (this.pasoActual < 3) {
      this.pasoActual++;
    }
  }

  anteriorPaso() {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  agendarCita() {
    console.log('Agendando cita:', this.citaData);
    // Lógica para agendar cita en backend
    alert('¡Cita agendada exitosamente!');
    this.resetForm();
  }

  getDoctoresFiltrados() {
    if (!this.citaData.especialidad) {
      return this.doctores;
    }
    return this.doctores.filter(doctor => 
      doctor.especialidad === this.citaData.especialidad
    );
  }

  private resetForm() {
    this.citaData = {
      especialidad: '',
      doctorId: 0,
      fecha: '',
      hora: '',
      motivo: ''
    };
    this.pasoActual = 1;
  }
}