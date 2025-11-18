import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AdminService, Usuario, Paciente, Doctor, RegistroPersonalRequest, Especialidad, BloqueoHorarioRequest, DoctorUpdateDTO, PacienteUpdateDTO, AdminUpdateDTO, BloqueoHorario } from '../services/admin.service';

@Component({
  selector: 'app-gestion-personal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    HeaderComponent
  ],
  templateUrl: './gestion-personal.component.html',
  styleUrls: ['./gestion-personal.component.scss']
})
export class GestionPersonalComponent implements OnInit {
  // Formularios de REGISTRO
  doctorForm: FormGroup;
  adminForm: FormGroup;
  pacienteForm: FormGroup;
  bloqueoForm: FormGroup;
  bloqueoEdicionForm: FormGroup;
  editDoctorForm: FormGroup;
  editPacienteForm: FormGroup;
  editAdminForm: FormGroup;
  
  // Datos
  usuarios: Usuario[] = [];
  doctores: Doctor[] = [];
  administradores: Usuario[] = [];
  pacientes: Paciente[] = [];
  especialidades: Especialidad[] = [];
  bloqueos: BloqueoHorarioRequest[] = [];
  editBloqueos: BloqueoHorario[] = [];
  editNuevosBloqueos: BloqueoHorarioRequest[] = [];
  
  // Modales de REGISTRO
  showDoctorModal = false;
  showAdminModal = false;
  showPacienteModal = false;
  showAgregarBloqueoModal = false;
  showAgregarBloqueoEdicionModal = false;
  // Modales de EDICIÓN
  showEditDoctorModal = false;
  showEditPacienteModal = false;
  showEditAdminModal = false;
  
  // Estados
  activeTab: 'usuarios' | 'doctores' | 'administradores' | 'pacientes' = 'usuarios';
  searchTerm = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Variables para almacenar el usuario en edición
  doctorEnEdicion: Doctor | null = null;
  pacienteEnEdicion: Paciente | null = null;
  adminEnEdicion: Usuario | null = null;

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    // ========== FORMULARIOS DE REGISTRO ==========
    this.doctorForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: [''],
      direccion: [''],
      especialidadId: ['', Validators.required],
      horarioAtencionInicio: ['08:00', Validators.required],
      horarioAtencionFin: ['18:00', Validators.required],
      duracionCitaMinutos: [30, [Validators.required, Validators.min(15), Validators.max(120)]]
    });

    this.adminForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: [''],
      direccion: ['']
    });

    this.pacienteForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: [''],
      direccion: [''],
      seguroMedico: ['']
    });

    this.bloqueoForm = this.fb.group({
      fechaInicio: ['', Validators.required],
      horaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      horaFin: ['', Validators.required],
      motivo: ['', Validators.required],
      esRecurrente: [false]
    });

    this.bloqueoEdicionForm = this.fb.group({
      fechaInicio: ['', Validators.required],
      horaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      horaFin: ['', Validators.required],
      motivo: ['', Validators.required],
      esRecurrente: [false]
    });

    this.editDoctorForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      password: ['', Validators.minLength(6)],
      especialidadId: ['', Validators.required],
      horarioAtencionInicio: ['', Validators.required],
      horarioAtencionFin: ['', Validators.required],
      duracionCitaMinutos: [30, [Validators.required, Validators.min(15), Validators.max(120)]]
    });

    this.editPacienteForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      seguroMedico: [''],
      password: ['', Validators.minLength(6)] // ✅ Opcional
    });

    this.editAdminForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      password: ['', Validators.minLength(6)]
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

  private cargarBloqueosParaDoctores(): void {
    this.doctores.forEach(doctor => {
      this.adminService.obtenerBloqueosPorDoctor(doctor.id).subscribe({
        next: (bloqueos) => {
          // Actualizar el doctor con sus bloqueos
          doctor.bloqueos = bloqueos;
          doctor.totalBloqueos = bloqueos.length;
        },
        error: (error) => {
          console.error(`Error al cargar bloqueos para doctor ${doctor.id}:`, error);
          doctor.bloqueos = [];
          doctor.totalBloqueos = 0;
        }
      });
    });
  }

  loadDoctores(): void {
    this.isLoading = true;
    this.adminService.obtenerTodosLosDoctores().subscribe({
      next: (data) => {
        // CARGAR BLOQUEOS PARA CADA DOCTOR
        this.doctores = data;
        
        // Opcional: Cargar bloqueos para cada doctor
        this.cargarBloqueosParaDoctores();
        
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

  // =================== MODALES DOCTOR (REGISTRO) ===================

  openDoctorModal(): void {
    this.doctorForm.reset({
      horarioAtencionInicio: '08:00',
      horarioAtencionFin: '18:00',
      duracionCitaMinutos: 30
    });
    this.bloqueos = [];
    this.showDoctorModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeDoctorModal(): void {
    this.showDoctorModal = false;
    this.doctorForm.reset();
    this.bloqueos = [];
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

      this.isLoading = true;
      this.errorMessage = '';
      
      this.adminService.registrarPersonal(request).subscribe({
        next: (response) => {
          if (this.bloqueos.length > 0) {
            const doctorId = this.extractDoctorIdFromResponse(response);
            if (doctorId) {
              this.guardarBloqueos(doctorId);
            } else {
              this.finalizarRegistroDoctor();
            }
          } else {
            this.finalizarRegistroDoctor();
          }
        },
        error: (error) => {
          console.error('Error al registrar doctor:', error);
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

  private extractDoctorIdFromResponse(response: any): number | null {
    console.log('Extrayendo ID de respuesta:', response);
    
    // Si la respuesta es un string (mensaje de éxito)
    if (typeof response === 'string') {
      console.log('Respuesta es string, buscando ID...');
      const match = response.match(/ID[:\s]*(\d+)/i) || 
                    response.match(/doctor.*?(\d+)/i) ||
                    response.match(/registrado.*?(\d+)/i);
      if (match) {
        const id = parseInt(match[1], 10);
        console.log('ID encontrado en string:', id);
        return id;
      }
    }
    
    // Si la respuesta es un objeto
    if (response && typeof response === 'object') {
      console.log('Respuesta es objeto:', response);
      if (response.id) {
        console.log('ID encontrado en objeto:', response.id);
        return response.id;
      }
      // Buscar ID en diferentes propiedades
      if (response.doctorId) return response.doctorId;
      if (response.usuarioId) return response.usuarioId;
    }
    
    console.log('No se pudo extraer el ID');
    return null;
  }

  private guardarBloqueos(doctorId: number): void {
    let bloqueosGuardados = 0;
    const totalBloqueos = this.bloqueos.length;
    let hayErrores = false;

    this.bloqueos.forEach(bloqueo => {
      bloqueo.doctorId = doctorId;
      
      this.adminService.crearBloqueoHorario(bloqueo).subscribe({
        next: (result) => {
          bloqueosGuardados++;
          if (bloqueosGuardados === totalBloqueos) {
            this.finalizarRegistroDoctor(hayErrores);
          }
        },
        error: (error) => {
          console.error('Error al guardar bloqueo:', error);
          hayErrores = true;
          bloqueosGuardados++;
          if (bloqueosGuardados === totalBloqueos) {
            this.finalizarRegistroDoctor(hayErrores);
          }
        }
      });
    });
  }

  private finalizarRegistroDoctor(hayErroresBloqueos: boolean = false): void {
    if (hayErroresBloqueos) {
      this.successMessage = 'Doctor registrado, pero algunos bloqueos no se guardaron';
    } else if (this.bloqueos.length > 0) {
      this.successMessage = 'Doctor y bloqueos registrados exitosamente';
    } else {
      this.successMessage = 'Doctor registrado exitosamente';
    }
    
    this.isLoading = false;
    this.closeDoctorModal();
    this.bloqueos = [];
    this.loadDoctores();
    this.loadUsuarios();
    this.clearMessages();
  }

  // =================== MODALES DOCTOR (EDICIÓN) ===================

  openEditDoctorModal(doctor: Doctor): void {
    this.doctorEnEdicion = doctor;
    
    console.log('Iniciando carga de doctor ID:', doctor.id);
        this.isLoading = true;
    this.adminService.obtenerDoctorPorId(doctor.id).subscribe({
      next: (doctorCompleto: any) => {
        console.log(' Doctor completo cargado:', doctorCompleto);
        console.log(' Bloqueos recibidos:', doctorCompleto.bloqueos);
        
        // Cargar los datos del doctor en el formulario
        this.editDoctorForm.patchValue({
          dni: doctorCompleto.dni,
          nombre: doctorCompleto.nombre,
          apellido: doctorCompleto.apellido,
          email: doctorCompleto.email,
          telefono: doctorCompleto.telefono || '',
          direccion: doctorCompleto.direccion || '',
          password: '', // Siempre vacío al inicio
          especialidadId: doctorCompleto.especialidad?.id || '',
          horarioAtencionInicio: doctorCompleto.horarioAtencionInicio || '08:00',
          horarioAtencionFin: doctorCompleto.horarioAtencionFin || '18:00',
          duracionCitaMinutos: doctorCompleto.duracionCitaMinutos || 30
        });

        // CARGAR BLOQUEOS EXISTENTES
        if (doctorCompleto.bloqueos && Array.isArray(doctorCompleto.bloqueos)) {
          this.editBloqueos = doctorCompleto.bloqueos.map((bloqueo: any) => ({
            id: bloqueo.id,
            doctorId: bloqueo.doctor?.id || doctor.id,
            inicioBloqueo: bloqueo.inicioBloqueo,
            finBloqueo: bloqueo.finBloqueo,
            motivo: bloqueo.motivo,
            esRecurrente: bloqueo.esRecurrente || false
          }));
          console.log('Bloqueos mapeados:', this.editBloqueos);
        } else {
          this.editBloqueos = [];
          console.log('No hay bloqueos o no es un array');
        }
        
        this.isLoading = false;
        this.showEditDoctorModal = true;
      },
      error: (error) => {
        console.error('Error al cargar doctor:', error);
        console.error('Error details:', error.error, error.status, error.message);
        
        // Si falla, usar los datos básicos que ya tenemos
        this.loadBasicDoctorData(doctor);
        this.isLoading = false;
        this.showEditDoctorModal = true;
      }
    });

    this.editNuevosBloqueos = [];
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Método de respaldo si falla la carga completa
  private loadBasicDoctorData(doctor: Doctor): void {
    this.editDoctorForm.patchValue({
      dni: doctor.dni,
      nombre: doctor.nombre,
      apellido: doctor.apellido,
      email: doctor.email,
      telefono: doctor.telefono || '',
      direccion: doctor.direccion || '',
      password: '',
      especialidadId: doctor.especialidad?.id || '',
      horarioAtencionInicio: doctor.horarioAtencionInicio || '08:00',
      horarioAtencionFin: doctor.horarioAtencionFin || '18:00',
      duracionCitaMinutos: doctor.duracionCitaMinutos || 30
    });
    this.editBloqueos = [];
  }

  closeEditDoctorModal(): void {
    this.showEditDoctorModal = false;
    this.editDoctorForm.reset();
    this.doctorEnEdicion = null;
    this.editBloqueos = [];
  }

  updateDoctor(): void {
  if (this.editDoctorForm.valid && this.doctorEnEdicion) {
    const formData = this.editDoctorForm.value;
    
    const updateDTO: DoctorUpdateDTO = {
      dni: formData.dni,
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      especialidadId: formData.especialidadId,
      horarioAtencionInicio: formData.horarioAtencionInicio,
      horarioAtencionFin: formData.horarioAtencionFin,
      duracionCitaMinutos: formData.duracionCitaMinutos
    };

    if (formData.password && formData.password.trim() !== '') {
      updateDTO.password = formData.password;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.actualizarDoctor(this.doctorEnEdicion.id, updateDTO).subscribe({
      next: (response) => {
        // Si hay nuevos bloqueos, guardarlos
        if (this.editNuevosBloqueos.length > 0) {
          this.guardarNuevosBloqueos();
        } else {
          this.finalizarEdicionDoctor();
        }
      },
      error: (error) => {
        console.error('Error al actualizar doctor:', error);
        this.errorMessage = error.error || 'Error al actualizar doctor';
        this.isLoading = false;
        this.clearMessages();
      }
    });
  } else {
    Object.keys(this.editDoctorForm.controls).forEach(key => {
      this.editDoctorForm.get(key)?.markAsTouched();
    });
  }
}

private guardarNuevosBloqueos(): void {
  let bloqueosGuardados = 0;
  const totalBloqueos = this.editNuevosBloqueos.length;

  this.editNuevosBloqueos.forEach(bloqueo => {
    this.adminService.crearBloqueoHorario(bloqueo).subscribe({
      next: () => {
        bloqueosGuardados++;
        if (bloqueosGuardados === totalBloqueos) {
          this.finalizarEdicionDoctor();
        }
      },
      error: (error) => {
        console.error('Error al guardar bloqueo:', error);
        bloqueosGuardados++;
        if (bloqueosGuardados === totalBloqueos) {
          this.finalizarEdicionDoctor();
        }
      }
    });
  });
}

private finalizarEdicionDoctor(): void {
  this.successMessage = 'Doctor actualizado exitosamente';
  this.isLoading = false;
  this.closeEditDoctorModal();
  this.loadDoctores();
  this.loadUsuarios();
  this.clearMessages();
}

  cargarBloqueosDoctor(doctorId: number): void {
    this.adminService.obtenerBloqueosPorDoctor(doctorId).subscribe({
      next: (bloqueos: BloqueoHorario[]) => {
        this.editBloqueos = bloqueos.map(b => ({
          id: b.id,
          doctorId: b.doctorId,
          inicioBloqueo: b.inicioBloqueo,
          finBloqueo: b.finBloqueo,
          motivo: b.motivo,
          esRecurrente: b.esRecurrente || false
        }));
      },
      error: (error) => {
        console.error('Error al cargar bloqueos:', error);
        this.editBloqueos = [];
      }
    });
  }

  eliminarBloqueoExistente(bloqueoId: number): void {
    if (confirm('¿Está seguro de eliminar este bloqueo?')) {
      this.adminService.eliminarBloqueoHorario(bloqueoId).subscribe({
        next: () => {
          this.successMessage = 'Bloqueo eliminado exitosamente';
          // Remover de la lista local
          this.editBloqueos = this.editBloqueos.filter(b => b.id !== bloqueoId);
          this.clearMessages();
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar bloqueo: ' + error.error;
          this.clearMessages();
        }
      });
    }
  }

  // =================== MODALES PACIENTE (EDICIÓN) ===================

  openEditPacienteModal(paciente: Paciente): void {
    this.pacienteEnEdicion = paciente;
    
    this.editPacienteForm.patchValue({
      dni: paciente.dni,
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      email: paciente.email,
      telefono: paciente.telefono || '',
      direccion: paciente.direccion || '',
      seguroMedico: paciente.seguroMedico || '',
      password: ''
    });

    this.showEditPacienteModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeEditPacienteModal(): void {
    this.showEditPacienteModal = false;
    this.editPacienteForm.reset();
    this.pacienteEnEdicion = null;
    this.editBloqueos = [];
    this.editNuevosBloqueos = [];
  }

  updatePaciente(): void {
    if (this.editPacienteForm.valid && this.pacienteEnEdicion) {
      const formData = this.editPacienteForm.value;
      
      const updateDTO: PacienteUpdateDTO = {
        dni: formData.dni,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        seguroMedico: formData.seguroMedico
      };

      // ✅ Solo enviar password si se ingresó una nueva
      if (formData.password && formData.password.trim() !== '') {
        updateDTO.password = formData.password;
      }

      this.isLoading = true;
      this.errorMessage = '';

      this.adminService.actualizarPaciente(this.pacienteEnEdicion.id, updateDTO).subscribe({
        next: (response) => {
          this.successMessage = 'Paciente actualizado exitosamente';
          this.isLoading = false;
          this.closeEditPacienteModal();
          this.loadPacientes();
          this.loadUsuarios();
          this.clearMessages();
        },
        error: (error) => {
          console.error('Error al actualizar paciente:', error);
          this.errorMessage = error.error || 'Error al actualizar paciente';
          this.isLoading = false;
          this.clearMessages();
        }
      });
    } else {
      Object.keys(this.editPacienteForm.controls).forEach(key => {
        this.editPacienteForm.get(key)?.markAsTouched();
      });
    }
  }

  // =================== MODALES ADMIN (EDICIÓN) ===================

  openEditAdminModal(admin: Usuario): void {
    this.adminEnEdicion = admin;
    
    this.editAdminForm.patchValue({
      dni: admin.dni,
      nombre: admin.nombre,
      apellido: admin.apellido,
      email: admin.email,
      telefono: admin.telefono || '',
      direccion: admin.direccion || '',
      password: ''
    });

    this.showEditAdminModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeEditAdminModal(): void {
    this.showEditAdminModal = false;
    this.editAdminForm.reset();
    this.adminEnEdicion = null;
  }

  updateAdmin(): void {
    if (this.editAdminForm.valid && this.adminEnEdicion) {
      const formData = this.editAdminForm.value;
      
      const updateDTO: AdminUpdateDTO = {
        dni: formData.dni,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion
      };

      // Solo enviar password si se ingresó una nueva
      if (formData.password && formData.password.trim() !== '') {
        updateDTO.password = formData.password;
      }

      this.isLoading = true;
      this.errorMessage = '';

      this.adminService.actualizarAdministrador(this.adminEnEdicion.id, updateDTO).subscribe({
        next: (response) => {
          this.successMessage = 'Administrador actualizado exitosamente';
          this.isLoading = false;
          this.closeEditAdminModal();
          this.loadAdministradores();
          this.loadUsuarios();
          this.clearMessages();
        },
        error: (error) => {
          console.error('Error al actualizar administrador:', error);
          this.errorMessage = error.error || 'Error al actualizar administrador';
          this.isLoading = false;
          this.clearMessages();
        }
      });
    } else {
      Object.keys(this.editAdminForm.controls).forEach(key => {
        this.editAdminForm.get(key)?.markAsTouched();
      });
    }
  }

  // =================== MODALES ADMINISTRADOR (REGISTRO) ===================

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
        telefono: formData.telefono,
        rol: 'ADMINISTRADOR'
      };

      this.isLoading = true;
      this.errorMessage = '';
      
      this.adminService.registrarPersonal(request).subscribe({
        next: (response) => {
          this.successMessage = 'Administrador registrado exitosamente';
          this.isLoading = false;
          this.closeAdminModal();
          this.loadAdministradores();
          this.loadUsuarios();
          this.clearMessages();
        },
        error: (error) => {
          console.error('Error al registrar administrador:', error);
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

  // =================== MODALES PACIENTE (REGISTRO) ===================

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
        telefono: formData.telefono,
        direccion: formData.direccion,
        rol: 'PACIENTE',
        seguroMedico: formData.seguroMedico
      };

      this.isLoading = true;
      this.errorMessage = '';
      
      this.adminService.registrarPersonal(request).subscribe({
        next: (response) => {
          this.successMessage = 'Paciente registrado exitosamente';
          this.isLoading = false;
          this.closePacienteModal();
          this.loadPacientes();
          this.loadUsuarios();
          this.clearMessages();
        },
        error: (error) => {
          console.error('Error al registrar paciente:', error);
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

  // =================== MODALES BLOQUEO ===================

  openAgregarBloqueoModal(): void {
    this.bloqueoForm.reset({ esRecurrente: false });
    this.showAgregarBloqueoModal = true;
  }

  closeAgregarBloqueoModal(): void {
    this.showAgregarBloqueoModal = false;
    this.bloqueoForm.reset();
  }

  openAgregarBloqueoEdicionModal(): void {
    this.bloqueoEdicionForm.reset({ esRecurrente: false });
    this.showAgregarBloqueoEdicionModal = true;
  }

  closeAgregarBloqueoEdicionModal(): void {
    this.showAgregarBloqueoEdicionModal = false;
    this.bloqueoEdicionForm.reset();
  }

  agregarBloqueo(): void {
    if (this.bloqueoForm.valid) {
      const formData = this.bloqueoForm.value;
      
      const inicioBloqueo = `${formData.fechaInicio}T${formData.horaInicio}:00`;
      const finBloqueo = `${formData.fechaFin}T${formData.horaFin}:00`;

      const nuevoBloqueo: BloqueoHorarioRequest = {
        doctorId: 0,
        inicioBloqueo: inicioBloqueo,
        finBloqueo: finBloqueo,
        motivo: formData.motivo,
        esRecurrente: formData.esRecurrente,
        id: 0
      };

      this.bloqueos.push(nuevoBloqueo);
      this.closeAgregarBloqueoModal();
      this.successMessage = 'Bloqueo agregado. Recuerda guardar el doctor para aplicar los cambios.';
      this.clearMessages();
    } else {
      Object.keys(this.bloqueoForm.controls).forEach(key => {
        this.bloqueoForm.get(key)?.markAsTouched();
      });
    }
  }

  agregarBloqueoEdicion(): void {
    if (this.bloqueoEdicionForm.valid && this.doctorEnEdicion) {
      const formData = this.bloqueoEdicionForm.value;
      
      const inicioBloqueo = `${formData.fechaInicio}T${formData.horaInicio}:00`;
      const finBloqueo = `${formData.fechaFin}T${formData.horaFin}:00`;

      const nuevoBloqueo: BloqueoHorarioRequest = {
        doctorId: this.doctorEnEdicion.id,
        inicioBloqueo: inicioBloqueo,
        finBloqueo: finBloqueo,
        motivo: formData.motivo,
        esRecurrente: formData.esRecurrente,
        id: 0
      };

      this.editNuevosBloqueos.push(nuevoBloqueo);
      this.closeAgregarBloqueoEdicionModal();
      this.successMessage = 'Bloqueo agregado. Recuerda guardar los cambios del doctor.';
      this.clearMessages();
    } else {
      Object.keys(this.bloqueoEdicionForm.controls).forEach(key => {
        this.bloqueoEdicionForm.get(key)?.markAsTouched();
      });
    }
  }

  eliminarBloqueo(index: number): void {
    this.bloqueos.splice(index, 1);
    this.successMessage = 'Bloqueo eliminado de la lista temporal';
    this.clearMessages();
  }

  eliminarBloqueoTemporal(index: number): void {
    this.editNuevosBloqueos.splice(index, 1);
    this.successMessage = 'Bloqueo eliminado de la lista temporal';
    this.clearMessages();
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

  // MÉTODO PARA VER TODOS LOS BLOQUEOS DE UN DOCTOR
  verTodosBloqueos(doctor: Doctor): void {
    if (doctor.bloqueos && doctor.bloqueos.length > 0) {
      const mensaje = doctor.bloqueos.map((bloqueo, index) => {
        const inicio = new Date(bloqueo.inicioBloqueo).toLocaleString();
        const fin = new Date(bloqueo.finBloqueo).toLocaleString();
        const recurrente = bloqueo.esRecurrente ? ' (Recurrente)' : '';
        return `${index + 1}. ${bloqueo.motivo}\n   ${inicio} - ${fin}${recurrente}`;
      }).join('\n\n');

      alert(`Bloqueos de horario - Dr. ${doctor.nombre} ${doctor.apellido}\n\n${mensaje}`);
    }
  }

  // Para la Opción 2 (expandible)
  toggleBloqueos(doctor: Doctor): void {
    doctor.mostrarBloqueos = !doctor.mostrarBloqueos;
  }

  // Para la Opción 3 (modal)
  verDetallesBloqueos(doctor: Doctor): void {
    if (doctor.bloqueos && doctor.bloqueos.length > 0) {
      const mensaje = this.formatearBloqueos(doctor.bloqueos);
      
      // Puedes usar un modal propio o alert temporal
      alert(`📅 Bloqueos de Horario - Dr. ${doctor.nombre} ${doctor.apellido}\n\n${mensaje}`);
    }
  }

  // Método para formatear bloqueos
  private formatearBloqueos(bloqueos: BloqueoHorario[]): string {
    return bloqueos.map((bloqueo, index) => {
      const inicio = new Date(bloqueo.inicioBloqueo);
      const fin = new Date(bloqueo.finBloqueo);
      
      const fechaInicio = inicio.toLocaleDateString('es-ES');
      const horaInicio = inicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const horaFin = fin.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      
      const recurrente = bloqueo.esRecurrente ? ' 🔄 (Recurrente)' : '';
      
      return `${index + 1}. ${bloqueo.motivo}\n   📅 ${fechaInicio} ⏰ ${horaInicio} - ${horaFin}${recurrente}`;
    }).join('\n\n');
  }
}