// app.routes.ts

import { Routes } from '@angular/router';
import { PermissionGuard } from './core/guards/permission.guard';
import { HomeComponent } from './pages/auth/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardPacienteComponent } from './dashboards/dashboard-paciente.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { PacienteComponent } from './pages/auth/paciente/paciente.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AccesoDenegadoComponent } from './pages/auth/acceso-denegado/acceso-denegado.component';
import { DashboardEnfermeraComponent } from './dashboards/dashboard-enfermera.component';
import { EnfermeraComponent } from './pages/auth/enfermera/enfermera.component';
import { MedicoComponent } from './pages/auth/medico/medico.component';
import { DashboardMedicoComponent } from './dashboards/dashboard-medico.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'acceso-denegado', component: AccesoDenegadoComponent },
  {
    path: 'paciente',
    component: PacienteComponent,
    canActivate: [authGuard, PermissionGuard],
    data: { permiso: 'pacientes:read' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard-paciente',
        pathMatch: 'full'
      },
     {
  path: 'dashboard-paciente',
  component: DashboardPacienteComponent,
  canActivate: [authGuard, PermissionGuard],
  data: { permiso: ['consultas:read', 'recetas:read'] } 
}

    ]
  },

{
  path: 'enfermera',
  component: EnfermeraComponent, // Layout o página padre
  canActivate: [authGuard],
  children: [
    {
      path: '',
      redirectTo: 'dashboard-enfermera',
      pathMatch: 'full'
    },
    {
      path: 'dashboard-enfermera',
      component: DashboardEnfermeraComponent,
      canActivate: [PermissionGuard],
      data: { permiso: ['consultas:read', 'expedientes:read'] }
    }
  ]
},
{
  path: 'medico',
  component: MedicoComponent, // Puede ser un layout vacío
  canActivate: [authGuard],
  children: [
    {
      path: '',
      redirectTo: 'dashboard-medico',
      pathMatch: 'full'
    },
    {
      path: 'dashboard-medico',
      component: DashboardMedicoComponent,
      canActivate: [PermissionGuard],
      data: { permiso: ['consultas:read', 'recetas:read', 'expedientes:read'] }
    }
  ]
},
 {
path: 'configurar-mfa',
    loadComponent: () =>
      import('./components/totp-setup/totp-setup.component').then(
        (m) => m.TotpSetupComponent
      )
  }
];
