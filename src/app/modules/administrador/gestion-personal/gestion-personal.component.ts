import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // <-- Agregar ReactiveFormsModule
import { HeaderComponent } from '../../../shared/components/header/header.component';

interface Usuario {
  id?: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  rol: string;
  activo: boolean;
}

interface Doctor extends Usuario {
  especialidad: string;
  licencia: string;
  horarioInicio: string;
  horarioFin: string;
}

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
  personalForm: FormGroup;
  doctorForm: FormGroup;
  usuarios: Usuario[] = [];
  doctores: Doctor[] = [];
  especialidades: string[] = ['MEDICINA_GENERAL', 'CARDIOLOGIA', 'PEDIATRIA', 'GINECOLOGIA', 'TRAUMATOLOGIA'];
  
  showModal = false;
  showDoctorModal = false;
  editMode = false;
  selectedUsuario: Usuario | null = null;
  selectedDoctor: Doctor | null = null;
  activeTab: 'usuarios' | 'doctores' = 'usuarios';
  searchTerm = '';

  constructor(private fb: FormBuilder) {
    // Inicializar formulario de usuario
    this.personalForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      rol: ['DOCTOR', Validators.required],
      activo: [true]
    });

    // Inicializar formulario de doctor
    this.doctorForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      especialidad: ['', Validators.required],
      licencia: ['', Validators.required],
      horarioInicio: ['08:00', Validators.required],
      horarioFin: ['18:00', Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.loadUsuarios();
    this.loadDoctores();
  }

  loadUsuarios(): void {
    // Datos de ejemplo para probar
    this.usuarios = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@hospital.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '123456789',
        rol: 'ADMIN',
        activo: true
      },
      {
        id: 2,
        username: 'maria.garcia',
        email: 'maria@hospital.com',
        nombre: 'María',
        apellido: 'García',
        telefono: '987654321',
        rol: 'PACIENTE',
        activo: true
      }
    ];
  }

  loadDoctores(): void {
    // Datos de ejemplo para probar
    this.doctores = [
      {
        id: 3,
        username: 'dr.lopez',
        email: 'lopez@hospital.com',
        nombre: 'Carlos',
        apellido: 'López',
        telefono: '555666777',
        rol: 'DOCTOR',
        activo: true,
        especialidad: 'CARDIOLOGIA',
        licencia: 'LIC-12345',
        horarioInicio: '08:00',
        horarioFin: '16:00'
      },
      {
        id: 4,
        username: 'dra.martinez',
        email: 'martinez@hospital.com',
        nombre: 'Ana',
        apellido: 'Martínez',
        telefono: '444555666',
        rol: 'DOCTOR',
        activo: true,
        especialidad: 'PEDIATRIA',
        licencia: 'LIC-67890',
        horarioInicio: '09:00',
        horarioFin: '17:00'
      }
    ];
  }

  openModal(): void {
    this.editMode = false;
    this.personalForm.reset({ rol: 'DOCTOR', activo: true });
    this.showModal = true;
  }

  openDoctorModal(): void {
    this.editMode = false;
    this.doctorForm.reset({ 
      horarioInicio: '08:00', 
      horarioFin: '18:00', 
      activo: true 
    });
    this.showDoctorModal = true;
  }

  editUsuario(usuario: Usuario): void {
    this.editMode = true;
    this.selectedUsuario = usuario;
    this.personalForm.patchValue(usuario);
    // Remover validación de password en edición
    this.personalForm.get('password')?.clearValidators();
    this.personalForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  editDoctor(doctor: Doctor): void {
    this.editMode = true;
    this.selectedDoctor = doctor;
    this.doctorForm.patchValue(doctor);
    // Remover validación de password en edición
    this.doctorForm.get('password')?.clearValidators();
    this.doctorForm.get('password')?.updateValueAndValidity();
    this.showDoctorModal = true;
  }

  saveUsuario(): void {
    if (this.personalForm.valid) {
      const data = this.personalForm.value;
      
      if (this.editMode && this.selectedUsuario) {
        // Actualizar usuario existente
        const index = this.usuarios.findIndex(u => u.id === this.selectedUsuario!.id);
        if (index !== -1) {
          this.usuarios[index] = { ...this.selectedUsuario, ...data };
        }
        console.log('Actualizar usuario:', data);
      } else {
        // Crear nuevo usuario
        const newUsuario: Usuario = {
          ...data,
          id: Math.max(...this.usuarios.map(u => u.id || 0)) + 1
        };
        this.usuarios.push(newUsuario);
        console.log('Crear usuario:', data);
      }
      
      this.closeModal();
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.personalForm.controls).forEach(key => {
        this.personalForm.get(key)?.markAsTouched();
      });
    }
  }

  saveDoctor(): void {
    if (this.doctorForm.valid) {
      const data = this.doctorForm.value;
      
      if (this.editMode && this.selectedDoctor) {
        // Actualizar doctor existente
        const index = this.doctores.findIndex(d => d.id === this.selectedDoctor!.id);
        if (index !== -1) {
          this.doctores[index] = { ...this.selectedDoctor, ...data };
        }
        console.log('Actualizar doctor:', data);
      } else {
        // Crear nuevo doctor
        const newDoctor: Doctor = {
          ...data,
          id: Math.max(...this.doctores.map(d => d.id || 0)) + 1,
          rol: 'DOCTOR'
        };
        this.doctores.push(newDoctor);
        console.log('Crear doctor:', data);
      }
      
      this.closeDoctorModal();
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.doctorForm.controls).forEach(key => {
        this.doctorForm.get(key)?.markAsTouched();
      });
    }
  }

  deleteUsuario(id: number): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      // Eliminar de la lista correspondiente
      if (this.activeTab === 'usuarios') {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
      } else {
        this.doctores = this.doctores.filter(d => d.id !== id);
      }
      console.log('Eliminar usuario:', id);
    }
  }

  toggleUsuarioActivo(usuario: Usuario): void {
    usuario.activo = !usuario.activo;
    console.log('Toggle activo:', usuario);
  }

  closeModal(): void {
    this.showModal = false;
    this.personalForm.reset();
    this.selectedUsuario = null;
    // Restaurar validación de password
    this.personalForm.get('password')?.setValidators(Validators.required);
    this.personalForm.get('password')?.updateValueAndValidity();
  }

  closeDoctorModal(): void {
    this.showDoctorModal = false;
    this.doctorForm.reset();
    this.selectedDoctor = null;
    // Restaurar validación de password
    this.doctorForm.get('password')?.setValidators(Validators.required);
    this.doctorForm.get('password')?.updateValueAndValidity();
  }

  get filteredUsuarios(): Usuario[] {
    if (!this.searchTerm) return this.usuarios;
    
    const term = this.searchTerm.toLowerCase();
    return this.usuarios.filter(u => 
      u.nombre.toLowerCase().includes(term) ||
      u.apellido.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.username.toLowerCase().includes(term)
    );
  }

  get filteredDoctores(): Doctor[] {
    if (!this.searchTerm) return this.doctores;
    
    const term = this.searchTerm.toLowerCase();
    return this.doctores.filter(d => 
      d.nombre.toLowerCase().includes(term) ||
      d.apellido.toLowerCase().includes(term) ||
      d.especialidad.toLowerCase().includes(term)
    );
  }
}