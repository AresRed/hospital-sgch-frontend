import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PacienteService, PacienteUpdateDTO } from '../services/paciente.service';
import { AuthService } from '../../../core/auth/auth.service';
import { MessageService } from '../../../core/services/message.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  isLoading: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.cargarDatosPerfil();
  }

  initForm(): void {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required], // El email no se puede editar
      telefono: ['', [Validators.pattern(/^[0-9]{9}$/)]],
      direccion: [''],
      seguroMedico: ['']
    });
  }

  cargarDatosPerfil(): void {
    this.isLoading = true;
    this.pacienteService.getPerfil().subscribe({
      next: (data) => {
        this.perfilForm.patchValue({
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          seguroMedico: data.seguroMedico || ''
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.showError('Error', 'No se pudieron cargar los datos del perfil.');
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      this.messageService.showWarn('Advertencia', 'Por favor, complete correctamente los campos obligatorios.');
      return;
    }

    this.isLoading = true;
    // Se usa getRawValue() para incluir los campos deshabilitados como el email
    const perfilData: PacienteUpdateDTO = this.perfilForm.getRawValue();

    this.pacienteService.actualizarPerfil(perfilData).subscribe({
      next: (response) => {
        this.messageService.showSuccess('Perfil Actualizado', 'Tu perfil ha sido actualizado correctamente.');
        
        // Actualizar la información del usuario en AuthService para que se refleje en toda la app
        const userInfo = this.authService.getUserInfo();
        if (userInfo) {
          const updatedUserInfo = {
            ...userInfo,
            nombre: perfilData.nombre,
            // Aquí podrías actualizar más campos si son parte de UserInfo
          };
          this.authService.saveUserInfo(updatedUserInfo);
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.showError('Error al actualizar', err.error?.message || 'No se pudo actualizar el perfil.');
        this.isLoading = false;
      }
    });
  }
}
