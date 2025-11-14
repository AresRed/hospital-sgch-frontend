import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { InputTextModule } from 'primeng/inputtext'; 
import { ButtonModule } from 'primeng/button';       
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule, 
    ButtonModule,
    PasswordModule,
    FloatLabelModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Inicialización del formulario con validadores
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Getter para un acceso fácil a los controles del formulario en el HTML
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.errorMessage = '';
    
    if (this.loginForm.invalid) {
      // Marcar todos los campos como 'touched' para mostrar los errores de validación
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true; // Activar spinner

    // Llamar al servicio de autenticación. El token y los datos del usuario se guardan automáticamente.
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // Redirigir al dashboard según el rol
        this.redirectToRoleDashboard(response.rol);
      },
      error: (err) => {
        // Mostrar error del backend (ej: Credenciales inválidas)
        this.loading = false;
        // El error del backend estará en err.error.message o err.error
        this.errorMessage = err.error?.message || 'Email o contraseña incorrectos.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  
  // Método auxiliar para la redirección
  private redirectToRoleDashboard(role: string): void {
    switch (role) {
      case 'ADMINISTRADOR':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'DOCTOR':
        this.router.navigate(['/doctor/agenda']);
        break;
      case 'PACIENTE':
        this.router.navigate(['/paciente/mis-citas']);
        break;
      default:
        this.router.navigate(['/']); 
    }
  }
}
