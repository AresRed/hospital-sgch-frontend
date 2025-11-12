import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Paciente {
  id: number;
  nombre: string;
  edad: number;
  genero: string;
  telefono: string;
  ultimaVisita: Date;
}

interface Expediente {
  id: number;
  pacienteId: number;
  alergias: string[];
  condiciones: string[];
  medicamentos: string[];
  notas: NotaMedica[];
}

interface NotaMedica {
  id: number;
  fecha: Date;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  doctor: string;
}

@Component({
  selector: 'app-expediente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.scss']
})
export class ExpedienteComponent implements OnInit {
  pacientes: Paciente[] = [];
  expedienteSeleccionado: Expediente | null = null;
  pacienteSeleccionado: Paciente | null = null;
  searchTerm: string = '';

  nuevaNota = {
    sintomas: '',
    diagnostico: '',
    tratamiento: ''
  };

  showNotaModal = false;

  constructor() {}

  ngOnInit() {
    this.cargarPacientes();
  }

  cargarPacientes() {
    this.pacientes = [
      {
        id: 1,
        nombre: 'María García López',
        edad: 35,
        genero: 'Femenino',
        telefono: '+1234567890',
        ultimaVisita: new Date('2024-01-10')
      },
      {
        id: 2,
        nombre: 'Carlos Rodríguez',
        edad: 42,
        genero: 'Masculino',
        telefono: '+0987654321',
        ultimaVisita: new Date('2024-01-08')
      }
    ];
  }

  seleccionarPaciente(paciente: Paciente) {
    this.pacienteSeleccionado = paciente;
    this.cargarExpediente(paciente.id);
  }

  cargarExpediente(pacienteId: number) {
    this.expedienteSeleccionado = {
      id: 1,
      pacienteId: pacienteId,
      alergias: ['Penicilina', 'Mariscos'],
      condiciones: ['Hipertensión', 'Diabetes tipo 2'],
      medicamentos: ['Metformina 500mg', 'Losartán 50mg'],
      notas: [
        {
          id: 1,
          fecha: new Date('2024-01-10'),
          sintomas: 'Dolor de cabeza persistente, visión borrosa',
          diagnostico: 'Crisis hipertensiva',
          tratamiento: 'Ajuste dosis de Losartán, reposo',
          doctor: 'Dr. Juan Pérez'
        }
      ]
    };
  }

  abrirModalNota() {
    this.nuevaNota = { sintomas: '', diagnostico: '', tratamiento: '' };
    this.showNotaModal = true;
  }

  agregarNota() {
    if (this.expedienteSeleccionado) {
      const nuevaNota: NotaMedica = {
        id: Date.now(),
        fecha: new Date(),
        sintomas: this.nuevaNota.sintomas,
        diagnostico: this.nuevaNota.diagnostico,
        tratamiento: this.nuevaNota.tratamiento,
        doctor: 'Dr. Actual'
      };

      this.expedienteSeleccionado.notas.unshift(nuevaNota);
      this.nuevaNota = { sintomas: '', diagnostico: '', tratamiento: '' };
      this.showNotaModal = false;
    }
  }

  getPacientesFiltrados() {
    if (!this.searchTerm) {
      return this.pacientes;
    }
    return this.pacientes.filter(paciente =>
      paciente.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}