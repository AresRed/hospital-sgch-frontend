import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaces para tipado de datos
export interface Doctor {
  id: number;
  nombreCompleto: string;
  especialidadNombre: string;
}

export interface Cita {
  id: number;
  doctor: any;
  paciente: any;
  fechaHora: string;
  estado: string;
  motivo?: string;
}

export interface Receta {
  id: number;
  fechaEmision: string;
  detalles: { nombreMedicamento: string; dosis: string; }[];
}

export interface Especialidad {
  id: number;
  nombre: string;
}

export interface PacienteUpdateDTO {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  seguroMedico?: string;
}

export interface PerfilPaciente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  rol: string;
  seguroMedico: string;
}

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private baseUrl = `${environment.apiUrl}/paciente`;

  constructor(private http: HttpClient) { }

  /**
   * GET /paciente/doctores
   * Obtiene la lista de todos los doctores.
   */
  getDoctores(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/doctores`);
  }

  /**
   * GET /paciente/citas/horarios
   * Obtiene los horarios disponibles para un doctor en una fecha específica.
   */
  getHorarios(doctorId: number, fecha: string): Observable<string[]> {
    const params = new HttpParams()
      .set('doctorId', doctorId.toString())
      .set('fecha', fecha);
    return this.http.get<string[]>(`${this.baseUrl}/citas/horarios`, { params });
  }

  /**
   * POST /paciente/citas/agendar
   * Agenda una nueva cita.
   */
  agendarCita(citaData: { doctorId: number; fechaCandidata: string; horaSeleccionada: string; motivo: string; }): Observable<Cita> {
    return this.http.post<Cita>(`${this.baseUrl}/citas/agendar`, citaData);
  }

  /**
   * DELETE /paciente/citas/cancelar/{id}
   * Cancela una cita existente.
   */
  cancelarCita(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.baseUrl}/citas/cancelar/${id}`);
  }

  /**
   * PUT /paciente/citas/postergar/{id}
   * Postergay/o modifica una cita existente.
   */
  postergarCita(id: number, nuevaCitaData: { nuevoDoctorId: number; nuevaFecha: string; nuevaHora: string; nuevoMotivo: string; }): Observable<Cita> {
    return this.http.put<Cita>(`${this.baseUrl}/citas/postergar/${id}`, nuevaCitaData);
  }

  /**
   * GET /paciente/historial/ultima-receta
   * Obtiene la última receta del historial del paciente.
   */

  /**
   * PUT /paciente/perfil
   * Actualiza los datos del perfil del paciente.
   */
  actualizarPerfil(perfilData: PacienteUpdateDTO): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.baseUrl}/perfil`, perfilData);
  }

  /**
   * GET /paciente/perfil
   * Obtiene los datos del perfil del paciente autenticado.
   */
  getPerfil(): Observable<PerfilPaciente> {
    return this.http.get<PerfilPaciente>(`${this.baseUrl}/perfil`);
  }

  /**
   * GET /paciente/citas
   * Obtiene todas las citas del paciente actual.
   */
  getMisCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}/citas`);
  }

  /**
   * GET /paciente/historial/recetas
   * Obtiene el historial completo de recetas del paciente.
   */
  getHistorialRecetas(): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.baseUrl}/recetas`);
  }

  /**
   * GET /paciente/receta/{recetaId}/pdf
   * Descarga una receta específica en formato PDF.
   */
  descargarRecetaPdf(recetaId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/receta/${recetaId}/pdf`, {
      responseType: 'blob' // Es importante para manejar archivos
    });
  }

  /**
   * GET /paciente/citas/{id} (Simulado)
   * Obtiene los detalles de una cita específica.
   * NOTA: El backend no tiene este endpoint, así que lo simularemos en el frontend
   * o asumiremos que se puede obtener de la lista de `getMisCitas`.
   * Por ahora, añadimos un método que podría usarse si el endpoint existiera.
   */
  getCitaById(id: number): Observable<Cita> {
    // Este es un placeholder. En una app real, harías una llamada a:
    // return this.http.get<Cita>(`${this.baseUrl}/citas/${id}`);
    // Como no existe, este método no se usará directamente, pero es buena práctica tenerlo.
    // La lógica se manejará en el componente `agendar-cita`.
    return new Observable<Cita>(); // Retorna un observable vacío.
  }
}
