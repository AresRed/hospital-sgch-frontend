import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService, Doctor, Cita } from '../services/paciente.service';
import { MessageService } from '../../../core/services/message.service';
import { AuthService } from '../../../core/auth/auth.service';

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
  especialidades: string[] = []; // Almacenará nombres de especialidades únicas
  doctores: Doctor[] = [];
  doctoresFiltrados: Doctor[] = [];
  horariosDisponibles: HorarioDisponible[] = [];
  
  citaId: number | null = null;
  esReprogramacion = false;

  citaData = {
    especialidad: '', // Cambiado de especialidadId a string
    doctorId: 0,
    fecha: '',
    hora: '',
    motivo: ''
  };

  pasoActual: number = 1;
  isLoading: boolean = false;

  constructor(
    private pacienteService: PacienteService,
    private messageService: MessageService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDoctoresYEspecialidades();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.citaId = +id;
        this.esReprogramacion = true;
        // La carga de datos de la cita se hará después de cargar los doctores
      }
    });
  }

  cargarDoctoresYEspecialidades() {
    this.isLoading = true;
    this.pacienteService.getDoctores().subscribe({
      next: (data) => {
        this.doctores = data;
        this.doctoresFiltrados = data; // Inicialmente mostrar todos

        // Extraer especialidades únicas de la lista de doctores
        const especialidadesUnicas = [...new Set(data.map(d => d.especialidadNombre))];
        this.especialidades = especialidadesUnicas;
        
        this.isLoading = false;

        // Si es una reprogramación, cargar los datos de la cita ahora
        if (this.esReprogramacion) {
          this.cargarDatosCita();
        }
      },
      error: (err) => {
        this.messageService.showError('Error', 'No se pudieron cargar los doctores.');
        this.isLoading = false;
      }
    });
  }

  cargarDatosCita() {
    this.pacienteService.getMisCitas().subscribe(citas => {
      const cita = citas.find(c => c.id === this.citaId);
      if (cita) {
        const doctor = this.doctores.find(d => d.id === cita.doctor.id);
        if (doctor) {
          this.citaData.especialidad = doctor.especialidadNombre;
          this.onEspecialidadChange(); // Filtrar doctores
        }

        const fechaHora = new Date(cita.fechaHora);
        this.citaData = {
          ...this.citaData,
          doctorId: cita.doctor.id,
          fecha: fechaHora.toISOString().split('T')[0],
          hora: fechaHora.toTimeString().split(' ')[0].substring(0, 5),
          motivo: cita.motivo || ''
        };
      }
    });
  }

  onEspecialidadChange() {
    this.citaData.doctorId = 0;
    this.citaData.fecha = '';
    this.citaData.hora = '';
    this.horariosDisponibles = [];
    
    if (this.citaData.especialidad) {
      this.doctoresFiltrados = this.doctores.filter(d => d.especialidadNombre === this.citaData.especialidad);
    } else {
      this.doctoresFiltrados = this.doctores;
    }
  }

  onDoctorChange() {
    this.generarHorariosDisponibles();
  }

  generarHorariosDisponibles() {
    if (this.citaData.doctorId && this.citaData.fecha) {
      this.isLoading = true;
      this.pacienteService.getHorarios(this.citaData.doctorId, this.citaData.fecha).subscribe({
        next: (horarios) => {
          this.horariosDisponibles = horarios.map(hora => ({
            fecha: this.citaData.fecha,
            hora: hora,
            disponible: true
          }));
          this.isLoading = false;
        },
        error: (err) => {
          this.messageService.showError('Error', 'No se pudieron cargar los horarios disponibles.');
          this.isLoading = false;
        }
      });
    } else {
      this.horariosDisponibles = [];
    }
  }

  getNombreDoctor(): string {
    const doctor = this.doctores.find(d => d.id === this.citaData.doctorId);
    return doctor ? doctor.nombreCompleto : 'No seleccionado';
  }

  siguientePaso() {
    if (this.pasoActual === 1 && !this.citaData.especialidad) {
      this.messageService.showWarn('Advertencia', 'Por favor, seleccione una especialidad.');
      return;
    }
    if (this.pasoActual === 2 && (!this.citaData.doctorId || !this.citaData.fecha || !this.citaData.hora)) {
      this.messageService.showWarn('Advertencia', 'Por favor, seleccione un doctor, fecha y hora.');
      return;
    }

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
    this.isLoading = true;

    if (this.esReprogramacion && this.citaId) {
      const reprogramarPayload = {
        nuevoDoctorId: this.citaData.doctorId,
        nuevaFecha: this.citaData.fecha,
        nuevaHora: this.citaData.hora,
        nuevoMotivo: this.citaData.motivo
      };
      this.pacienteService.postergarCita(this.citaId, reprogramarPayload).subscribe({
        next: () => {
          this.messageService.showSuccess('Cita Reprogramada', 'Su cita ha sido reprogramada exitosamente.');
          this.router.navigate(['/paciente/mis-citas']);
          this.isLoading = false;
        },
        error: (err) => {
          this.messageService.showError('Error al reprogramar', err.error?.message || 'No se pudo reprogramar la cita.');
          this.isLoading = false;
        }
      });
    } else {
      const citaPayload = {
        doctorId: this.citaData.doctorId,
        fechaCandidata: this.citaData.fecha,
        horaSeleccionada: this.citaData.hora,
        motivo: this.citaData.motivo
      };

      this.pacienteService.agendarCita(citaPayload).subscribe({
        next: () => {
          this.messageService.showSuccess('Cita Agendada', 'Su cita ha sido agendada exitosamente.');
          this.resetForm();
          this.isLoading = false;
        },
        error: (err) => {
          this.messageService.showError('Error al agendar', err.error?.message || 'No se pudo agendar la cita.');
          this.isLoading = false;
        }
      });
    }
  }

  private resetForm() {
    this.citaData = {
      especialidad: '',
      doctorId: 0,
      fecha: '',
      hora: '',
      motivo: ''
    };
    this.horariosDisponibles = [];
    this.pasoActual = 1;
    this.doctoresFiltrados = this.doctores;
  }
}
