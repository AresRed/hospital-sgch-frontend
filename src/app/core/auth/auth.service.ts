import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = environment.apiUrl + '/auth/';
const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_info';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    // La ruta completa será: http://localhost:8080/api/auth/login
    return this.http.post(BASE_URL + 'login', credentials);
  }

  register(userData: any): Observable<any> {
    // La ruta completa será: http://localhost:8080/api/auth/registro
    return this.http.post(BASE_URL + 'registro', userData);
  }

  logout(): void {
    // La ruta completa será: http://localhost:8080/api/auth/logout
    this.http.post(BASE_URL + 'logout', {}).subscribe();
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
  }

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Guarda la información esencial del usuario (ID, rol, email) en el localStorage.
   * @param userInfo Objeto con la información del usuario.
   */
  saveUserInfo(userInfo: { id: number, rol: string, email: string }): void {
    // Usamos JSON.stringify para guardar el objeto complejo
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
  }
  
  // Métodos de recuperación de datos (Útiles para Guards y Navegación)

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUserInfo(): any | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    // El usuario está autenticado si el token existe
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
