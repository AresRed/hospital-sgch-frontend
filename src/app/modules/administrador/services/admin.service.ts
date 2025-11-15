import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Usuario {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  rol: string;
  activo: boolean;
  fechaRegistro?: string;
}

export interface Doctor extends Usuario {
  especialidadNombre?: string;
  especialidad?: {
    id: number;
    nombre: string;
  };
  horarioAtencionInicio?: string;
  horarioAtencionFin?: string;
  duracionCitaMinutos?: number;
}

export interface Paciente extends Usuario {
  seguroMedico?: string;
}

// NUEVA INTERFAZ PARA ESPECIALIDAD
export interface Especialidad {
  id?: number;
  nombre: string;
  descripcion?: string;
}

// NUEVA INTERFAZ PARA CITA
export interface Cita {
  id: number;
  doctor: any;
  paciente: any;
  fechaHora: string;
  estado: string;
  motivo?: string;
}

// NUEVA INTERFAZ PARA ESTADÍSTICAS RESUMEN
export interface EstadisticasResumen {
  totalDoctores: number;
  totalPacientes: number;
  totalAdministradores: number;
  totalUsuariosActivos: number;
  totalCitas: number;
}

export interface RegistroPersonalRequest {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  rol: string;
  especialidadId?: number;  // Para doctor
  horarioAtencionInicio?: string;
  horarioAtencionFin?: string;
  duracionCitaMinutos?: number;
  seguroMedico?: string;
  direccion?: string;
}

export interface ReporteGenerado {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  fechaGeneracion: Date;
  descargado: boolean;
  rutaImagen?: string;
  metric: string;
}

export interface MetricaReporte {
  value: string;
  label: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;
  private especialidadesUrl = `${environment.apiUrl}/especialidades`;

  constructor(private http: HttpClient) { }

  // =================== MÉTODOS DE ESPECIALIDADES ===================

  obtenerEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.especialidadesUrl);
  }

  crearEspecialidad(especialidad: Especialidad): Observable<Especialidad> {
    return this.http.post<Especialidad>(this.especialidadesUrl, especialidad);
  }

  actualizarEspecialidad(id: number, especialidad: Especialidad): Observable<Especialidad> {
    return this.http.put<Especialidad>(`${this.especialidadesUrl}/${id}`, especialidad);
  }

  eliminarEspecialidad(id: number): Observable<string> {
    return this.http.delete(`${this.especialidadesUrl}/${id}`, { responseType: 'text' });
  }

  // =================== MÉTODOS EXISTENTES ===================
  
  obtenerTodosLosUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`);
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/usuarios/${id}`);
  }

  obtenerUsuariosPorRol(rol: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios/rol/${rol}`);
  }

  eliminarUsuario(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}`, { responseType: 'text' });
  }

  actualizarEstadoUsuario(userId: number, activo: boolean): Observable<string> {
    const params = new HttpParams().set('activo', activo.toString());
    return this.http.put(`${this.baseUrl}/usuario/${userId}/estado`, null, { 
      params, 
      responseType: 'text' 
    });
  }

  registrarPersonal(request: RegistroPersonalRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/personal/registrar`, request, {
      responseType: 'text'
    });
  }

  obtenerTodosLosDoctores(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/doctores`);
  }

  obtenerDoctorPorId(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}/doctores/${id}`);
  }

  obtenerTodosLosPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/pacientes`);
  }

  obtenerPacientePorId(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.baseUrl}/pacientes/${id}`);
  }

  // MÉTODO CORREGIDO - usa la interfaz Cita
  buscarCitas(doctorId?: number, fecha?: string): Observable<Cita[]> {
    let params = new HttpParams();
    if (doctorId) {
      params = params.set('doctorId', doctorId.toString());
    }
    if (fecha) {
      params = params.set('fecha', fecha);
    }
    return this.http.get<Cita[]>(`${this.baseUrl}/citas/buscar`, { params });
  }

  // MÉTODO CORREGIDO - usa la interfaz EstadisticasResumen
  generarEstadisticas(metric: string = 'cancelaciones'): Observable<string> {
    const params = new HttpParams().set('metric', metric);
    return this.http.get(`${this.baseUrl}/estadisticas`, { 
      params, 
      responseType: 'text' 
    });
  }

  obtenerResumenEstadisticas(): Observable<EstadisticasResumen> {
    return this.http.get<EstadisticasResumen>(`${this.baseUrl}/estadisticas/resumen`);
  }

  // =================== NUEVOS MÉTODOS PARA REPORTES ===================

  /**
   * Método para descargar el gráfico generado por Python
   */
  descargarGrafico(metric: string): Observable<Blob> {
    const params = new HttpParams().set('metric', metric);
    return this.http.get(`${this.baseUrl}/estadisticas/descargar`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Obtiene las métricas disponibles para reportes
   * (Por ahora mock, se puede conectar con backend si existe endpoint)
   */
  obtenerMetricasDisponibles(): Observable<MetricaReporte[]> {
    // Mock data - se puede reemplazar con llamada HTTP si el backend provee las métricas
    const metricas: MetricaReporte[] = [
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
    
    return new Observable(observer => {
      observer.next(metricas);
      observer.complete();
    });
  }

  /**
   * Método para obtener reportes históricos del backend
   * (Por ahora mock, se implementará cuando el backend tenga el endpoint)
   */
  obtenerReportesHistoricos(): Observable<ReporteGenerado[]> {
    // Mock - se reemplazará con llamada HTTP real
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  /**
   * Método para guardar un reporte en el backend
   * (Por ahora mock, se implementará cuando el backend tenga el endpoint)
   */
  guardarReporte(reporte: ReporteGenerado): Observable<ReporteGenerado> {
    // Mock - se reemplazará con llamada HTTP real
    return new Observable(observer => {
      observer.next(reporte);
      observer.complete();
    });
  }
}