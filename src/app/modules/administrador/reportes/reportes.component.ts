import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AdminService, EstadisticasResumen, ReporteGenerado, MetricaReporte  } from '../services/admin.service';


@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  reportes: ReporteGenerado[] = [];
  estadisticas: EstadisticasResumen | null = null;
  metricasDisponibles: MetricaReporte[] = [];
  
  filtro = {
    metrica: '',
    fechaInicio: '',
    fechaFin: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  imagenGenerada: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.cargarEstadisticas();
    this.cargarMetricasDisponibles();
    this.cargarReportesHistoricos();
  }

  cargarEstadisticas() {
    this.isLoading = true;
    this.adminService.obtenerResumenEstadisticas().subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.errorMessage = 'Error al cargar estadísticas del sistema';
        this.isLoading = false;
      }
    });
  }

  cargarMetricasDisponibles() {
    this.adminService.obtenerMetricasDisponibles().subscribe({
      next: (metricas) => {
        this.metricasDisponibles = metricas;
      },
      error: (error) => {
        console.error('Error al cargar métricas:', error);
        // Métricas por defecto en caso de error
        this.metricasDisponibles = [
          { 
            value: 'cancelaciones', 
            label: '📊 Tasa de Cancelación por Doctor', 
            descripcion: 'Analiza las cancelaciones por médico' 
          },
          { 
            value: 'citas_por_especialidad', 
            label: '🏥 Citas por Especialidad', 
            descripcion: 'Muestra citas realizadas por especialidad médica' 
          }
        ];
      }
    });
  }

  cargarReportesHistoricos() {
    // Cargar reportes guardados en localStorage
    const reportesGuardados = localStorage.getItem('reportes_generados');
    if (reportesGuardados) {
      this.reportes = JSON.parse(reportesGuardados);
    }
  }

  generarReporte() {
    if (!this.filtro.metrica) {
      this.errorMessage = 'Por favor selecciona una métrica para el reporte';
      this.clearMessages();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.imagenGenerada = null;

    this.adminService.generarEstadisticas(this.filtro.metrica).subscribe({
      next: (response: string) => {
        console.log('✅ Reporte generado:', response);
        
        // Extraer la ruta de la imagen de la respuesta
        const rutaImagen = this.extraerRutaImagen(response);
        
        const nuevoReporte = {
          id: Date.now(),
          titulo: this.getMetricaLabel(this.filtro.metrica),
          descripcion: `Reporte generado el ${new Date().toLocaleDateString()}`,
          tipo: this.filtro.metrica,
          fechaGeneracion: new Date(),
          descargado: false,
          rutaImagen: rutaImagen,
          metric: this.filtro.metrica
        } as ReporteGenerado;

        this.reportes.unshift(nuevoReporte);
        this.guardarReportesEnLocalStorage();
        
        this.successMessage = '✅ Reporte generado exitosamente con Python';
        this.isLoading = false;
        this.clearMessages();

        // Si hay imagen generada, mostrarla
        if (rutaImagen) {
          this.mostrarImagenGenerada(rutaImagen);
        }
      },
      error: (error) => {
        console.error('❌ Error al generar reporte:', error);
        this.errorMessage = error.error || 'Error al generar el reporte con Python';
        this.isLoading = false;
        this.clearMessages();
      }
    });
  }

  descargarReporte(reporte: ReporteGenerado) {
    this.isLoading = true;
    
    this.adminService.descargarGrafico(reporte.metric).subscribe({
      next: (blob: Blob) => {
        // Crear enlace de descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${reporte.tipo}_${new Date().getTime()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Marcar como descargado
        reporte.descargado = true;
        this.guardarReportesEnLocalStorage();
        
        this.successMessage = `📥 Reporte "${reporte.titulo}" descargado exitosamente`;
        this.isLoading = false;
        this.clearMessages();
      },
      error: (error) => {
        console.error('Error al descargar reporte:', error);
        this.errorMessage = 'Error al descargar el reporte';
        this.isLoading = false;
        this.clearMessages();
      }
    });
  }

  private extraerRutaImagen(response: string): string | null {
    if (typeof response === 'string') {
      const match = response.match(/Ruta: (.*\.png)/);
      return match ? match[1] : null;
    }
    return null;
  }

  private mostrarImagenGenerada(rutaImagen: string) {
    // En un entorno real, aquí cargarías la imagen desde el servidor
    this.imagenGenerada = 'assets/images/reporte-generado.png'; // Imagen de ejemplo
    this.successMessage += '. Gráfico generado con éxito.';
  }

  getMetricaBadgeClass(metrica: string): string {
    switch(metrica) {
      case 'cancelaciones':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'citas_por_especialidad':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  getMetricaLabel(metrica: string): string {
    const metricaObj = this.metricasDisponibles.find(m => m.value === metrica);
    return metricaObj ? metricaObj.label : metrica;
  }

  getMetricaDescripcion(metrica: string): string {
    const metricaObj = this.metricasDisponibles.find(m => m.value === metrica);
    return metricaObj ? metricaObj.descripcion : '';
  }

  getReportesCountByMetrica(metrica: string): number {
    return this.reportes.filter(reporte => reporte.tipo === metrica).length;
  }

  getReportesDescargados(): number {
    return this.reportes.filter(reporte => reporte.descargado).length;
  }

  guardarReportesEnLocalStorage() {
    localStorage.setItem('reportes_generados', JSON.stringify(this.reportes));
  }

  clearMessages(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000);
  }

  limpiarFiltros() {
    this.filtro = {
      metrica: '',
      fechaInicio: '',
      fechaFin: ''
    };
    this.imagenGenerada = null;
  }
}