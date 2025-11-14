import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs'; // Importar BehaviorSubject

const BASE_URL = environment.apiUrl + '/auth';
const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_info';

interface UserInfo {
  id: number;
  email: string;
  rol: string;
  nombre?: string; // Añadir nombre si es parte de la info del usuario
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUserInfo = new BehaviorSubject<UserInfo | null>(this.getUserInfoFromLocalStorage());
  currentUserInfo: Observable<UserInfo | null> = this._currentUserInfo.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.saveToken(response.token);
          const userInfo: UserInfo = {
            id: response.id,
            email: response.email,
            rol: response.rol,
            nombre: response.nombre // Asumiendo que el nombre también viene en la respuesta
          };
          this.saveUserInfo(userInfo);
          this._currentUserInfo.next(userInfo); // Emitir la nueva información del usuario
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${BASE_URL}/registro`, userData);
  }

  logout(): void {
    this.http.post(`${BASE_URL}/logout`, {}).subscribe({
      next: () => {
        this.clearSession();
      },
      error: () => {
        this.clearSession(); // Limpiar sesión incluso si hay error en el logout del backend
      }
    });
  }

  private clearSession(): void {
    this.removeToken();
    this.removeUserInfo();
    this._currentUserInfo.next(null); // Emitir null al cerrar sesión
  }

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Guarda la información esencial del usuario (ID, rol, email) en el localStorage
   * y actualiza el BehaviorSubject para notificar a los suscriptores.
   * @param userInfo Objeto con la información del usuario.
   */
  saveUserInfo(userInfo: UserInfo): void {
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
    this._currentUserInfo.next(userInfo); // Notificar a los suscriptores del cambio
  }
  
  // Métodos de recuperación de datos (Útiles para Guards y Navegación)

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUserInfo(): UserInfo | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private getUserInfoFromLocalStorage(): UserInfo | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Métodos de limpieza
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  removeUserInfo(): void {
    localStorage.removeItem(USER_KEY);
  }
}
