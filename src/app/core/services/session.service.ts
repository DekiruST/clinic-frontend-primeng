import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionService {
  getPermisos(): string[] {
    const permisos = localStorage.getItem('permisos');
    return permisos ? JSON.parse(permisos) : [];
  }
}
