import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';

interface Reporte {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  fechaGeneracion: Date;
  descargado: boolean;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  reportes: Reporte[] = [];
  tiposReporte = [
    { value: 'citas', label: 'Reporte de Citas' },
    { value: 'usuarios', label: 'Reporte de Usuarios' },
    { value: 'financiero', label: 'Reporte Financiero' },
    { value: 'medicamentos', label: 'Reporte de Medicamentos' }
  ];

  filtro = {
    tipo: 'todos',
    fechaInicio: '',
    fechaFin: ''
  };

  constructor() {}

  ngOnInit() {
    this.cargarReportes();
  }

  cargarReportes() {
    this.reportes = [
      {
        id: 1,
        titulo: 'Citas Mensuales',
        descripcion: 'Reporte de todas las citas del mes actual',
        tipo: 'citas',
        fechaGeneracion: new Date('2024-01-15'),
        descargado: true
      },
      {
        id: 2,
        titulo: 'Usuarios Registrados',
        descripcion: 'Listado de usuarios registrados en el sistema',
        tipo: 'usuarios',
        fechaGeneracion: new Date('2024-01-10'),
        descargado: false
      },
      {
        id: 3,
        titulo: 'Estado Financiero Trimestral',
        descripcion: 'Reporte financiero del último trimestre',
        tipo: 'financiero',
        fechaGeneracion: new Date('2024-01-05'),
        descargado: false
      }
    ];
  }

  getTipoBadgeClass(tipo: string): string {
    switch(tipo) {
      case 'citas': return 'bg-blue-100 text-blue-800';
      case 'usuarios': return 'bg-green-100 text-green-800';
      case 'financiero': return 'bg-purple-100 text-purple-800';
      case 'medicamentos': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getTipoLabel(tipo: string): string {
    const tipoObj = this.tiposReporte.find(t => t.value === tipo);
    return tipoObj ? tipoObj.label : tipo;
  }

  generarReporte() {
    // Validar filtros
    if (this.filtro.tipo === 'todos') {
      alert('Por favor selecciona un tipo de reporte');
      return;
    }

    if (!this.filtro.fechaInicio || !this.filtro.fechaFin) {
      alert('Por favor selecciona las fechas de inicio y fin');
      return;
    }

    // Generar nuevo reporte
    const nuevoReporte: Reporte = {
      id: this.reportes.length + 1,
      titulo: `Reporte ${this.getTipoLabel(this.filtro.tipo)} - ${new Date().toLocaleDateString()}`,
      descripcion: `Reporte generado para el período ${this.filtro.fechaInicio} al ${this.filtro.fechaFin}`,
      tipo: this.filtro.tipo,
      fechaGeneracion: new Date(),
      descargado: false
    };

    this.reportes.unshift(nuevoReporte); // Agregar al inicio
    
    console.log('Reporte generado:', nuevoReporte);
    alert('Reporte generado exitosamente');
  }

  descargarReporte(reporte: Reporte) {
    console.log('Descargando reporte:', reporte);
    reporte.descargado = true;
    
    // Simular descarga
    setTimeout(() => {
      alert(`Reporte "${reporte.titulo}" descargado exitosamente`);
    }, 500);
  }

  // Métodos para las estadísticas
  getReportesCountByTipo(tipo: string): number {
    return this.reportes.filter(reporte => reporte.tipo === tipo).length;
  }

  getReportesDescargados(): number {
    return this.reportes.filter(reporte => reporte.descargado).length;
  }
}