import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, EstadisticasResumen } from '../services/admin.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Metrica {
  key: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  // Estado
  loading = false;
  metricaSeleccionada: string | null = null;
  imagenReporte: SafeUrl | null = null;
  errorMessage: string | null = null;
  resumenEstadisticas: EstadisticasResumen | null = null;

  // Métricas disponibles
  metricas: Metrica[] = [
    {
      key: 'cancelaciones',
      label: 'Cancelaciones',
      icon: '🚫',
      color: 'from-red-500 to-pink-500',
      description: 'Tasa de cancelación de citas por doctor'
    },
    {
      key: 'citas_por_especialidad',
      label: 'Por Especialidad',
      icon: '📋',
      color: 'from-blue-500 to-cyan-500',
      description: 'Citas finalizadas agrupadas por especialidad'
    }
  ];

  constructor(
    private adminService: AdminService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.cargarResumenEstadisticas();
  }

  /**
   * Carga el resumen de estadísticas generales
   */
  cargarResumenEstadisticas(): void {
    this.adminService.obtenerResumenEstadisticas().subscribe({
      next: (data) => {
        this.resumenEstadisticas = data;
      },
      error: (error) => {
        console.error('Error al cargar resumen:', error);
      }
    });
  }

  /**
   * Genera un reporte según la métrica seleccionada
   */
  generarReporte(metricaKey: string): void {
    console.log('=== GENERANDO REPORTE ===');
    console.log('Métrica:', metricaKey);
    
    this.loading = true;
    this.errorMessage = null;
    this.metricaSeleccionada = metricaKey;
    this.imagenReporte = null;

    this.adminService.generarReporte(metricaKey).subscribe({
      next: (blob: Blob) => {
        console.log('✓ Blob recibido:', blob.size, 'bytes');
        console.log('Tipo:', blob.type);
        
        // Crear URL segura para la imagen
        const objectURL = URL.createObjectURL(blob);
        this.imagenReporte = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.loading = false;
        
        console.log('✓ Reporte generado exitosamente');
      },
      error: (error) => {
        console.error('=== ERROR AL GENERAR REPORTE ===');
        console.error('Status:', error.status);
        console.error('Error completo:', error);
        
        if (error.status === 204) {
          this.errorMessage = 'No hay datos suficientes para generar el reporte.';
        } else if (error.status === 400) {
          this.errorMessage = 'Métrica no válida.';
        } else if (error.status === 403) {
          this.errorMessage = 'No tienes permisos para generar reportes.';
        } else if (error.status === 500) {
          this.errorMessage = 'Error interno del servidor. Verifica los logs del backend.';
        } else {
          this.errorMessage = 'Error al generar el reporte. Intenta nuevamente.';
        }
        
        this.loading = false;
        this.imagenReporte = null;
      }
    });
  }

  /**
   * Descarga el reporte actual como imagen PNG
   */
  descargarReporte(): void {
    if (!this.imagenReporte || !this.metricaSeleccionada) return;

    this.adminService.generarReporte(this.metricaSeleccionada).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte_${this.metricaSeleccionada}_${Date.now()}.png`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al descargar reporte:', error);
        this.errorMessage = 'Error al descargar el reporte.';
      }
    });
  }

  /**
   * Limpia el reporte actual
   */
  limpiarReporte(): void {
    this.imagenReporte = null;
    this.metricaSeleccionada = null;
    this.errorMessage = null;
  }

  /**
   * Obtiene la métrica seleccionada
   */
  getMetricaInfo(): Metrica | undefined {
    return this.metricas.find(m => m.key === this.metricaSeleccionada);
  }

  fechaActual: Date = new Date();
}