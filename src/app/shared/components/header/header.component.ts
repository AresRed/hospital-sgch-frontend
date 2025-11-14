import { Component, OnInit, OnDestroy } from '@angular/core'; // Importar OnDestroy
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router'; // Importar NavigationEnd
import { AuthService } from '../../../core/auth/auth.service'; // Importar AuthService
import { Subscription } from 'rxjs'; // Importar Subscription

interface User {
  id: number; // Añadir id para consistencia con AuthService
  email: string;
  rol: string;
  nombre?: string; // Hacer nombre opcional si no siempre está presente
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy { // Implementar OnDestroy
  user: User | null = null;
  showUserMenu: boolean = false;
  showHeader: boolean = true; // Controla la visibilidad del header
  private userSubscription!: Subscription; // Suscripción para la información del usuario
  private routerSubscription!: Subscription; // Suscripción para eventos del router

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios de información del usuario
    this.userSubscription = this.authService.currentUserInfo.subscribe(userInfo => {
      this.user = userInfo;
      console.log('HeaderComponent: UserInfo actualizado:', this.user);
    });

    // Suscribirse a los eventos del router para controlar la visibilidad del header
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !event.urlAfterRedirects.startsWith('/auth');
        console.log('HeaderComponent: showHeader actualizado:', this.showHeader, 'Ruta:', event.urlAfterRedirects);
      }
    });
  }

  ngOnDestroy() {
    // Desuscribirse para evitar fugas de memoria
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    console.log('HeaderComponent: toggleUserMenu, showUserMenu:', this.showUserMenu);
  }

  logout() {
    console.log('HeaderComponent: Ejecutando logout...');
    this.authService.logout();
    this.router.navigate(['/auth']);
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
