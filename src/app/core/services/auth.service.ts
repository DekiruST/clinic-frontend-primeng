// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string; totp_code?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        this.setToken(res.access_token);
        this.setRefreshToken(res.refresh_token);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  register(data: {
    email: string;
    password: string;
    rol: string;
    especialidad?: string;
    id_paciente?: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getIsLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  getUserData(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (e) {
        console.error('Error decoding token', e);
        return null;
      }
    }
    return null;
  }
createPaciente(paciente: { nombre: string; contacto: string; seguro?: string | null }): Observable<{ id_paciente: number }> {
  return this.http.post<{ id_paciente: number }>(
    'http://localhost:8000/pacientes',
    paciente
  );
}

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }
  
hasPermission(permiso: string | string[]): boolean {
  const user = this.getUserData();
  if (!user?.permisos) return false;
  if (Array.isArray(permiso)) {
    return permiso.every(p => user.permisos.includes(p));
  }
  return user.permisos.includes(permiso);
}

getUserId(): number | null {
  const user = this.getUserData();
  return user?.user_id ?? null;
}
loginInit(email: string, password: string): Observable<any> {
  return this.http.post<any>('http://localhost:8000/auth/login/init', { email, password });
}

}
