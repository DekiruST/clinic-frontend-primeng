// acceso-denegado.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-acceso-denegado',
  template: `
    <div class="denied-card">
      <h2>Acceso Denegado</h2>
      <p>No tienes permisos para acceder a esta sección.</p>
      <a routerLink="/">Ir al inicio</a>
    </div>
  `,
  styles: [`
    .denied-card {
      text-align: center;
      margin-top: 4rem;
      padding: 2rem;
      border: 1px solid #e53935;
      border-radius: 1.5rem;
      background: #ffebee;
      color: #b71c1c;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
      box-shadow: 0 4px 24px #e57373;
    }
    a { color: #1976d2; text-decoration: underline; }
  `]
})
export class AccesoDenegadoComponent {}
