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
  bloqueos?: BloqueoHorario[];
  totalBloqueos?: number;
  mostrarBloqueos?: boolean;
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
  direccion?: string;
  rol: string;
  especialidadId?: number;
  horarioAtencionInicio?: string;
  horarioAtencionFin?: string;
  duracionCitaMinutos?: number;
  seguroMedico?: string;
}

export interface BloqueoHorario {
  id?: number;
  doctorId: number;
  inicioBloqueo: string; // ISO DateTime
  finBloqueo: string;    // ISO DateTime
  motivo: string;
  esRecurrente: boolean;
}

export interface BloqueoHorarioRequest {
  id: number;
  doctorId: number;
  inicioBloqueo: string;
  finBloqueo: string;
  motivo: string;
  esRecurrente: boolean;
}

export interface DoctorUpdateDTO {
  dni?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  password?: string;
  especialidadId: number;
  horarioAtencionInicio: string;
  horarioAtencionFin: string;
  duracionCitaMinutos: number;
}

export interface PacienteUpdateDTO {
  dni?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  seguroMedico?: string;
  password?: string;
}

export interface AdminUpdateDTO {
  dni?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  password?: string;
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

  obtenerDoctorPorId(id: number): Observable<any> {
    return this.http.get<Doctor>(`${this.baseUrl}/doctores/${id}`);
  }

  obtenerTodosLosPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/pacientes`);
  }

  obtenerPacientePorId(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.baseUrl}/pacientes/${id}`);
  }

  actualizarDoctor(id: number, dto: DoctorUpdateDTO): Observable<string> {
    return this.http.put(`${this.baseUrl}/doctores/${id}`, dto, {
      responseType: 'text'
    });
  }
  /**
   * Actualiza los datos de un paciente
   */
  actualizarPaciente(id: number, dto: PacienteUpdateDTO): Observable<string> {
    return this.http.put(`${this.baseUrl}/pacientes/${id}`, dto, {
      responseType: 'text'
    });
  }

  /**
   * Actualiza los datos de un administrador
   */
  actualizarAdministrador(id: number, dto: AdminUpdateDTO): Observable<string> {
    return this.http.put(`${this.baseUrl}/administradores/${id}`, dto, {
      responseType: 'text'
    });
  }
  // =================== MÉTODOS DE BLOQUEO DE HORARIO ===================

  /**
   * Crea un bloqueo de horario para un doctor
   */
  crearBloqueoHorario(request: BloqueoHorarioRequest): Observable<BloqueoHorario> {
    return this.http.post<BloqueoHorario>(`${this.baseUrl}/bloqueo-horario`, request);
  }

  /**
   * Obtiene todos los bloqueos de horario de un doctor
   */
  obtenerBloqueosPorDoctor(doctorId: number): Observable<BloqueoHorario[]> {
    return this.http.get<BloqueoHorario[]>(`${this.baseUrl}/bloqueo-horario/doctor/${doctorId}`);
  }

  /**
   * Elimina un bloqueo de horario
   */
  eliminarBloqueoHorario(bloqueoId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/bloqueo-horario/${bloqueoId}`, { responseType: 'text' });
  }


  // =================== ESTADÍSTICAS Y REPORTES ===================

  /**
   * Obtiene el resumen de estadísticas generales del sistema
   */
  obtenerResumenEstadisticas(): Observable<EstadisticasResumen> {
    return this.http.get<EstadisticasResumen>(`${this.baseUrl}/estadisticas/resumen`);
  }

  /**
   * Genera un reporte gráfico usando Python
   * @param metrica Tipo de métrica: 'cancelaciones' o 'citas_por_especialidad'
   * @returns Blob de la imagen PNG generada
   */
  generarReporte(metrica: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reportes/${metrica}`, {
      responseType: 'blob'
    });
  }

  /**
   * Obtiene las métricas disponibles del backend
   */
  obtenerMetricasDisponibles(): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(`${this.baseUrl}/reportes/metricas-disponibles`);
  }
  
}