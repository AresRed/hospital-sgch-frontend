import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { PacienteService, Receta } from '../services/paciente.service'; // Importar PacienteService y Receta
import { MessageService } from '../../../core/services/message.service'; // Importar nuestro MessageService

@Component({
  selector: 'app-historial',
  standalone: true, // Asegurarse de que sea standalone
  imports: [CommonModule], // Añadir CommonModule a los imports
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss'
})
export class HistorialComponent implements OnInit {
  recetas: Receta[] = [];
  isLoading: boolean = false;

  constructor(
    private pacienteService: PacienteService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarHistorialRecetas();
  }

  cargarHistorialRecetas(): void {
    this.isLoading = true;
    this.pacienteService.getHistorialRecetas().subscribe({
      next: (data) => {
        this.recetas = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.showError('Error', 'No se pudo cargar el historial de recetas.');
        this.isLoading = false;
      }
    });
  }

  descargarReceta(recetaId: number): void {
    this.isLoading = true;
    this.pacienteService.descargarRecetaPdf(recetaId).subscribe({
      next: (blob) => {
        // Crear un enlace en memoria para descargar el archivo
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `receta_${recetaId}.pdf`;
        a.click();
        URL.revokeObjectURL(objectUrl); // Liberar memoria
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.showError('Error', 'No se pudo descargar la receta.');
        this.isLoading = false;
      }
    });
  }
}
