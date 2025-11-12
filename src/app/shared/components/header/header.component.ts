import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface User {
  nombre: string;
  rol: string;
  email: string;
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  user: User | null = null;
  showUserMenu: boolean = false;

  constructor() {}

  ngOnInit() {
    // Datos de ejemplo - luego vendrán del servicio de auth
    this.user = {
      nombre: 'María García',
      rol: 'PACIENTE',
      email: 'maria@hospital.com'
    };
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    console.log('Cerrando sesión...');
    this.showUserMenu = false;
  }

  getRolDisplay(rol: string): string {
    switch(rol) {
      case 'ADMINISTRADOR': return 'Administrador';
      case 'DOCTOR': return 'Doctor';
      case 'PACIENTE': return 'Paciente';
      default: return rol;
    }
  }
}