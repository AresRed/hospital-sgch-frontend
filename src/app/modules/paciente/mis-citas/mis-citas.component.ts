import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // Importar Router
import { PacienteService, Cita } from '../services/paciente.service'; // Importar PacienteService y Cita
import { MessageService } from '../../../core/services/message.service'; // Importar nuestro MessageService

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mis-citas.component.html',
  styleUrl: './mis-citas.component.scss'
})
export class MisCitasComponent implements OnInit {
  citas: Cita[] = [];
  filtroEstado: string = 'todas';
  isLoading: boolean = false;

  constructor(
    private pacienteService: PacienteService,
    private messageService: MessageService,
    private router: Router // Inyectar Router
  ) {}

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.isLoading = true;
    this.pacienteService.getMisCitas().subscribe({
      next: (data) => {
        this.citas = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.showError('Error', 'No se pudieron cargar sus citas.');
        this.isLoading = false;
      }
    });
  }

  getEstadoBadgeClass(estado: string): string {
    switch(estado.toLowerCase()) { // Convertir a minúsculas para consistencia
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getBorderColor(estado: string): string {
    switch(estado.toLowerCase()) { // Convertir a minúsculas para consistencia
      case 'confirmada': return 'border-l-green-500';
      case 'pendiente': return 'border-l-yellow-500';
      case 'completada': return 'border-l-blue-500';
      case 'cancelada': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  }

  getCitasFiltradas(): Cita[] {
    if (this.filtroEstado === 'todas') {
      return this.citas;
    }
    return this.citas.filter(cita => cita.estado.toLowerCase() === this.filtroEstado);
  }

  getCitasCountByEstado(estado: string): number {
    return this.citas.filter(cita => cita.estado.toLowerCase() === estado).length;
  }

  getProximaCita(): Cita | null {
    const ahora = new Date();
    const citasFuturas = this.citas
      .filter(cita => new Date(cita.fechaHora) > ahora && cita.estado.toLowerCase() !== 'cancelada' && cita.estado.toLowerCase() !== 'completada')
      .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
    
    return citasFuturas.length > 0 ? citasFuturas[0] : null;
  }

  cancelarCita(citaId: number) {
    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      this.isLoading = true;
      this.pacienteService.cancelarCita(citaId).subscribe({
        next: (response) => {
          this.messageService.showSuccess('Cita Cancelada', response.mensaje);
          this.cargarCitas(); // Recargar citas para actualizar la lista
          this.isLoading = false;
        },
        error: (err) => {
          this.messageService.showError('Error al cancelar', err.error?.mensaje || 'No se pudo cancelar la cita.');
          this.isLoading = false;
        }
      });
    }
  }

  reprogramarCita(cita: Cita) {
    // Navegar al componente de agendar cita con el ID de la cita para reprogramarla.
    this.router.navigate(['/paciente/agendar', cita.id]);
  }
}
