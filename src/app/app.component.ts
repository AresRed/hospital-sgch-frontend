import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./modules/auth/login/login.component";
import { AuthComponent } from "./modules/auth/auth/auth.component";
import { ToastModule } from 'primeng/toast'; // Importar ToastModule
// import { MessageService } from 'primeng/api'; // Ya provisto globalmente en app.config.ts
import { HeaderComponent } from './shared/components/header/header.component'; // Importar HeaderComponent

@Component({
  selector: 'app-root',
  standalone: true, // Asegurarse de que sea standalone
  imports: [
    RouterOutlet,
    LoginComponent, // Mantener si se usa en alguna ruta directa sin layout
    AuthComponent, // Mantener si se usa en alguna ruta directa sin layout
    ToastModule, // Añadir ToastModule a los imports
    HeaderComponent // Añadir HeaderComponent a los imports
  ],
  // providers: [MessageService], // Ya provisto globalmente en app.config.ts
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'hospital-sgch-frontend';
}
