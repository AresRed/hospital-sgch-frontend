import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // <-- Agregar ReactiveFormsModule
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AdminService, Usuario, Paciente, Doctor, RegistroPersonalRequest, Especialidad } from '../services/admin.service';

@Component({
  selector: 'app-gestion-personal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, // <-- AGREGAR ESTO
    HeaderComponent
  ],
  templateUrl: './gestion-personal.component.html',
  styleUrls: ['./gestion-personal.component.scss']
})
export class GestionPersonalComponent implements OnInit {
  doctorForm: FormGroup;
  adminForm: FormGroup;
  pacienteForm: FormGroup;
  
  usuarios: Usuario[] = [];
  doctores: Doctor[] = [];
  administradores: Usuario[] = [];
  pacientes: Paciente[] = [];
  especialidades: Especialidad[] = [];
  
  showDoctorModal = false;
  showAdminModal = false;
  showPacienteModal = false;
  activeTab: 'usuarios' | 'doctores' | 'administradores' | 'pacientes' = 'usuarios';
  searchTerm = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    // Formulario para registrar Doctores
    this.doctorForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: [''],
      especialidadId: ['', Validators.required],
      horarioAtencionInicio: ['08:00', Validators.required],
      horarioAtencionFin: ['18:00', Validators.required],
      duracionCitaMinutos: [30, [Validators.required, Validators.min(15), Validators.max(120)]]
    });
    // Formulario para registrar Administradores
    this.adminForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Formulario para registrar Pacientes
    this.pacienteForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      seguroMedico: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsuarios();
    this.loadDoctores();
    this.loadAdministradores();
    this.loadPacientes();
    this.loadEspecialidades();
  }

  // =================== CARGA DE DATOS ===================

  loadUsuarios(): void {
    this.isLoading = true;
    this.adminService.obtenerTodosLosUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.errorMessage = 'Error al cargar la lista de usuarios';
        this.isLoading = false;
      }
    });
  }

  loadDoctores(): void {
    this.isLoading = true;
    this.adminService.obtenerTodosLosDoctores().subscribe({
      next: (data) => {
        this.doctores = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar doctores:', error);
        this.errorMessage = 'Error al cargar la lista de doctores';
        this.isLoading = false;
      }
    });
  }

  loadAdministradores(): void {
    this.isLoading = true;
    this.adminService.obtenerUsuariosPorRol('ADMINISTRADOR').subscribe({
      next: (data) => {
        this.administradores = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar administradores:', error);
        this.errorMessage = 'Error al cargar la lista de administradores';
        this.isLoading = false;
      }
    });
  }

  loadPacientes(): void {
    this.isLoading = true;
    this.adminService.obtenerTodosLosPacientes().subscribe({
      next: (data) => {
        this.pacientes = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
        this.errorMessage = 'Error al cargar la lista de pacientes';
        this.isLoading = false;
      }
    });
  }

  loadEspecialidades(): void {
    this.adminService.obtenerEspecialidades().subscribe({
      next: (data) => {
        this.especialidades = data;
        console.log('Especialidades cargadas:', data);
      },
      error: (error) => {
        console.error('Error al cargar especialidades:', error);
        // Si falla, usar especialidades por defecto temporalmente
        this.especialidades = [
          { id: 1, nombre: 'Cardiología' },
          { id: 2, nombre: 'Pediatría' },
          { id: 3, nombre: 'Ginecología' },
          { id: 4, nombre: 'Traumatología' },
          { id: 5, nombre: 'Medicina General' }
        ];
      }
    });
  }

  // =================== MODALES DOCTOR ===================

  openDoctorModal(): void {
    this.doctorForm.reset();
    this.showDoctorModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeDoctorModal(): void {
    this.showDoctorModal = false;
    this.doctorForm.reset();
  }

  saveDoctor(): void {
    if (this.doctorForm.valid) {
      const formData = this.doctorForm.value;
      
      const request: RegistroPersonalRequest = {
        dni: formData.dni,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono,
        rol: 'DOCTOR',
        especialidadId: formData.especialidadId,
        horarioAtencionInicio: formData.horarioAtencionInicio,
        horarioAtencionFin: formData.horarioAtencionFin,
        duracionCitaMinutos: formData.duracionCitaMinutos
      };

      console.log('Request Doctor:', request);

      this.isLoading = true;
      this.errorMessage = '';
      
      this.adminService.registrarPersonal(request).subscribe({
        next: (response) => {
          console.log('✅ Doctor registrado:', response);
          this.successMessage = 'Doctor registrado exitosamente';
          this.isLoading = false;
          this.closeDoctorModal();
          this.loadDoctores();
          this.loadUsuarios();
          this.clearMessages();
        },
        error: (error) => {
          console.error('❌ Error al registrar doctor:', error);
          this.errorMessage = error.error || 'Error al registrar doctor';
          this.isLoading = false;
          this.clearMessages();
        }
      });
    } else {
      Object.keys(this.doctorForm.controls).forEach(key => {
        this.doctorForm.get(key)?.markAsTouched();
      });
    }
  }

  // =================== MODALES ADMINISTRADOR ===================

  openAdminModal(): void {
    this.adminForm.reset();
    this.showAdminModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeAdminModal(): void {
    this.showAdminModal = false;
    this.adminForm.reset();
  }

  saveAdmin(): void {
    if (this.adminForm.valid) {
      const formData = this.adminForm.value;
      
      const request: RegistroPersonalRequest = {
        dni: formData.dni,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        rol: 'ADMINISTRADOR'
      };

      this.isLoading = true;
      this.errorMessage = '';
      
      this.adminService.registrarPersonal(request).subscribe({
        next: (response) => {
          console.log('✅ Administrador registrado:', response);
          this.successMessage = 'Administrador registrado exitosamente';
          this.isLoading = false;
          this.closeAdminModal();
          this.loadAdministradores();
          this.loadUsuarios();
          this.clearMessages();
        },
        error: (error) => {
          console.error('❌ Error al registrar administrador:', error);
          this.errorMessage = error.error || 'Error al registrar administrador';
          this.isLoading = false;
          this.clearMessages();
        }
      });
    } else {
      Object.keys(this.adminForm.controls).forEach(key => {
        this.adminForm.get(key)?.markAsTouched();
      });
    }
  }

  // =================== MODALES PACIENTE ===================

  openPacienteModal(): void {
    this.pacienteForm.reset();
    this.showPacienteModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closePacienteModal(): void {
    this.showPacienteModal = false;
    this.pacienteForm.reset();
  }

  savePaciente(): void {
    if (this.pacienteForm.valid) {
      const formData = this.pacienteForm.value;
      
      const request: RegistroPersonalRequest = {
        dni: formData.dni,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        rol: 'PACIENTE',
        seguroMedico: formData.seguroMedico
      };

      this.isLoading = true;
      this.errorMessage = '';
      
      this.adminService.registrarPersonal(request).subscribe({
        next: (response) => {
          console.log('✅ Paciente registrado:', response);
          this.successMessage = 'Paciente registrado exitosamente';
          this.isLoading = false;
          this.closePacienteModal();
          this.loadPacientes();
          this.loadUsuarios();
          this.clearMessages();
        },
        error: (error) => {
          console.error('❌ Error al registrar paciente:', error);
          this.errorMessage = error.error || 'Error al registrar paciente';
          this.isLoading = false;
          this.clearMessages();
        }
      });
    } else {
      Object.keys(this.pacienteForm.controls).forEach(key => {
        this.pacienteForm.get(key)?.markAsTouched();
      });
    }
  }

  // =================== ELIMINAR USUARIO ===================

  deleteUsuario(id: number): void {
    if (confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      this.isLoading = true;
      this.adminService.eliminarUsuario(id).subscribe({
        next: (response) => {
          this.successMessage = 'Usuario eliminado exitosamente';
          this.isLoading = false;
          this.usuarios = this.usuarios.filter(u => u.id !== id);
          this.doctores = this.doctores.filter(d => d.id !== id);
          this.administradores = this.administradores.filter(a => a.id !== id);
          this.pacientes = this.pacientes.filter(p => p.id !== id);
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar usuario';
          this.isLoading = false;
          this.clearMessages();
        }
      });
    }
  }

  // =================== TOGGLE ACTIVO ===================

  toggleUsuarioActivo(usuario: Usuario): void {
    const nuevoEstado = !usuario.activo;
    this.adminService.actualizarEstadoUsuario(usuario.id, nuevoEstado).subscribe({
      next: (response) => {
        usuario.activo = nuevoEstado;
        this.successMessage = `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`;
        this.clearMessages();
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar estado del usuario';
        this.clearMessages();
      }
    });
  }

  // =================== FILTROS ===================

  get filteredUsuarios(): Usuario[] {
    if (!this.searchTerm) return this.usuarios;
    const term = this.searchTerm.toLowerCase();
    return this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(term) ||
      u.apellido.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.dni.includes(term)
    );
  }

  get filteredDoctores(): Doctor[] {
    if (!this.searchTerm) return this.doctores;
    const term = this.searchTerm.toLowerCase();
    return this.doctores.filter(d =>
      d.nombre.toLowerCase().includes(term) ||
      d.apellido.toLowerCase().includes(term) ||
      d.email.toLowerCase().includes(term) ||
      d.dni.includes(term) ||
      (d.especialidadNombre && d.especialidadNombre.toLowerCase().includes(term))
    );
  }

  get filteredAdministradores(): Usuario[] {
    if (!this.searchTerm) return this.administradores;
    const term = this.searchTerm.toLowerCase();
    return this.administradores.filter(a =>
      a.nombre.toLowerCase().includes(term) ||
      a.apellido.toLowerCase().includes(term) ||
      a.email.toLowerCase().includes(term) ||
      a.dni.includes(term)
    );
  }

  get filteredPacientes(): Paciente[] {
    if (!this.searchTerm) return this.pacientes;
    const term = this.searchTerm.toLowerCase();
    return this.pacientes.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.apellido.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.dni.includes(term) ||
      (p.seguroMedico && p.seguroMedico.toLowerCase().includes(term))
    );
  }

  // =================== UTILIDADES ===================

  clearMessages(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000);
  }
}