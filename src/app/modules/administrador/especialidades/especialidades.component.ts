import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AdminService } from '../services/admin.service';

interface Especialidad {
  id?: number;
  nombre: string;
  descripcion?: string;
}

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.scss'
})
export class EspecialidadesComponent implements OnInit {
  especialidadForm: FormGroup;
  especialidades: Especialidad[] = [];
  showModal = false;
  editMode = false;
  selectedEspecialidad: Especialidad | null = null;
  searchTerm = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.especialidadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.loadEspecialidades();
  }

  loadEspecialidades(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.adminService.obtenerEspecialidades().subscribe({
      next: (data) => {
        this.especialidades = data;
        this.isLoading = false;
        console.log('Especialidades cargadas:', data);
      },
      error: (error) => {
        console.error('Error al cargar especialidades:', error);
        this.errorMessage = 'Error al cargar la lista de especialidades';
        this.isLoading = false;
      }
    });
  }

  openModal(): void {
    this.editMode = false;
    this.especialidadForm.reset();
    this.showModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  openEditModal(especialidad: Especialidad): void {
    this.editMode = true;
    this.selectedEspecialidad = especialidad;
    this.especialidadForm.patchValue({
      nombre: especialidad.nombre,
      descripcion: especialidad.descripcion || ''
    });
    this.showModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.especialidadForm.reset();
    this.selectedEspecialidad = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveEspecialidad(): void {
    if (this.especialidadForm.valid) {
      const formData = this.especialidadForm.value;
      const especialidad: Especialidad = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined
      };

      this.isLoading = true;
      this.errorMessage = '';

      if (this.editMode && this.selectedEspecialidad) {
        // Actualizar
        this.adminService.actualizarEspecialidad(this.selectedEspecialidad.id!, especialidad).subscribe({
          next: (response) => {
            console.log('Especialidad actualizada:', response);
            this.successMessage = 'Especialidad actualizada exitosamente';
            this.isLoading = false;
            this.closeModal();
            this.loadEspecialidades();
            this.clearMessages();
          },
          error: (error) => {
            console.error('Error al actualizar especialidad:', error);
            this.errorMessage = error.error || 'Error al actualizar especialidad';
            this.isLoading = false;
            this.clearMessages();
          }
        });
      } else {
        // Crear nueva
        this.adminService.crearEspecialidad(especialidad).subscribe({
          next: (response) => {
            console.log('Especialidad creada:', response);
            this.successMessage = 'Especialidad creada exitosamente';
            this.isLoading = false;
            this.closeModal();
            this.loadEspecialidades();
            this.clearMessages();
          },
          error: (error) => {
            console.error('Error al crear especialidad:', error);
            this.errorMessage = error.error || 'Error al crear especialidad';
            this.isLoading = false;
            this.clearMessages();
          }
        });
      }
    } else {
      Object.keys(this.especialidadForm.controls).forEach(key => {
        this.especialidadForm.get(key)?.markAsTouched();
      });
    }
  }

  deleteEspecialidad(id: number): void {
    if (confirm('¿Está seguro de eliminar esta especialidad? Los doctores asignados a esta especialidad podrían verse afectados.')) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.adminService.eliminarEspecialidad(id).subscribe({
        next: (response) => {
          console.log('Especialidad eliminada:', response);
          this.successMessage = 'Especialidad eliminada exitosamente';
          this.isLoading = false;
          this.especialidades = this.especialidades.filter(e => e.id !== id);
          this.clearMessages();
        },
        error: (error) => {
          console.error('Error al eliminar especialidad:', error);
          this.errorMessage = error.error || 'Error al eliminar especialidad';
          this.isLoading = false;
          this.clearMessages();
        }
      });
    }
  }

  get filteredEspecialidades(): Especialidad[] {
    if (!this.searchTerm) return this.especialidades;
    const term = this.searchTerm.toLowerCase();
    return this.especialidades.filter(e =>
      e.nombre.toLowerCase().includes(term) ||
      (e.descripcion && e.descripcion.toLowerCase().includes(term))
    );
  }

  clearMessages(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000);
  }
}
