import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';       // Para p-button
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext'; 
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';   
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone:true,
  imports: [
    CommonModule,
    ButtonModule,
    MessageModule,
    FloatLabelModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    PasswordModule
    
],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  roles = ['PACIENTE', 'DOCTOR', 'ADMINISTRADOR'];
  selectedRole: string = 'PACIENTE';
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.registerForm.get('rol')?.valueChanges.subscribe(role => {
      this.selectedRole = role;
      this.updateValidators(role);
    });
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]$/)]],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rol: [this.selectedRole, Validators.required],
      
      especialidad: [''], 
      seguroMedico: ['']
    });
  }

  updateValidators(role: string): void {
    const especialidadControl = this.registerForm.get('especialidad');
    const seguroMedicoControl = this.registerForm.get('seguroMedico');

    especialidadControl?.clearValidators();
    seguroMedicoControl?.clearValidators();

    if (role === 'DOCTOR') {
      especialidadControl?.setValidators(Validators.required);
    } else if (role === 'PACIENTE') {
      seguroMedicoControl?.setValidators(Validators.required);
    }
    
    especialidadControl?.updateValueAndValidity();
    seguroMedicoControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Por favor, complete correctamente todos los campos requeridos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formData = this.registerForm.value;
    const userData = {
      dni: formData.dni,
      nombre: formData.nombre,
      email: formData.email,
      password: formData.password,
      rol: formData.rol,
      especialidad: formData.rol === 'DOCTOR' ? formData.especialidad : null,
      seguroMedico: formData.rol === 'PACIENTE' ? formData.seguroMedico : null
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Registro exitoso. Se ha enviado un correo de verificación.');
        this.router.navigate(['/auth/login']); 
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error al registrarse. Intente con otro email/DNI.';
      }
    });
  }
}
