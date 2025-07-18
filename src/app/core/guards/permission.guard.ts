import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const expectedPerm = route.data['permiso'];
    const token = this.auth.getToken(); 
    if (!token) return this.router.parseUrl('/login');

  try {
    const decoded: any = jwtDecode(token);


    if (expectedRol) {
      const userRol = decoded.rol?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      if (userRol === expectedRol.toLowerCase()) {
        return true;
      }
    }


    if (expectedPerm) {
      if (Array.isArray(expectedPerm)) {
        if (expectedPerm.every((p: string) => decoded.permisos?.includes(p))) {
          return true;
        }
      } else {
        if (decoded.permisos?.includes(expectedPerm)) {
          return true;
        }
      }
    }

  } catch (e) {}

  return this.router.parseUrl('/acceso-denegado');
}
}
