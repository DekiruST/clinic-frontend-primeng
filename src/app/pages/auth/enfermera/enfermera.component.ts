// src/app/pages/auth/enfermera/enfermera.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { NgIf, AsyncPipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enfermera',
  standalone: true,
  imports: [CommonModule, TableModule, TabViewModule, ButtonModule, NgIf, AsyncPipe],
  template: `
    <div style="margin-bottom: 1rem">
      <button pButton label="Ir al inicio" (click)="goHome()"></button>
      <button pButton label="Cerrar sesión" class="p-button-danger" (click)="logout()"></button>
    </div>
    <p-tabView>
      <p-tabPanel header="Pacientes">
        <p-table *ngIf="(pacientes$ | async) as pacientes" [value]="pacientes">
          <ng-template pTemplate="header">
            <tr>
              <th>Nombre</th>
              <th>Seguro</th>
              <th>Contacto</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-paciente>
            <tr>
              <td>{{ paciente.nombre }}</td>
              <td>{{ paciente.seguro || '-' }}</td>
              <td>{{ paciente.contacto }}</td>
            </tr>
          </ng-template>
        </p-table>
      </p-tabPanel>
      <p-tabPanel header="Citas">
        <p-table *ngIf="(citas$ | async) as citas" [value]="citas">
          <ng-template pTemplate="header">
            <tr>
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Médico</th>
              <th>Diagnóstico</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-cita>
            <tr>
              <td>{{ cita.id_paciente }}</td>
              <td>{{ cita.horario | date:'short' }}</td>
              <td>{{ cita.tipo }}</td>
              <td>{{ cita.nombreMedico || 'Sin médico' }}</td>
              <td>{{ cita.diagnostico || '-' }}</td>
            </tr>
          </ng-template>
        </p-table>
      </p-tabPanel>
      <p-tabPanel header="Expedientes">
        <p-table *ngIf="(expedientes$ | async) as expedientes" [value]="expedientes">
          <ng-template pTemplate="header">
            <tr>
              <th>ID Paciente</th>
              <th>Antecedentes</th>
              <th>Historial Clínico</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-expediente>
            <tr>
              <td>{{ expediente.id_paciente }}</td>
              <td>{{ expediente.antecedentes }}</td>
              <td>{{ expediente.historial_clinico }}</td>
            </tr>
          </ng-template>
        </p-table>
      </p-tabPanel>
    </p-tabView>
  `
})
export class EnfermeraComponent implements OnInit {
  pacientes$!: Observable<any[]>;
  citas$!: Observable<any[]>;
  expedientes$!: Observable<any[]>;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.pacientes$ = this.http.get<any[]>('http://localhost:8000/enfermera/pacientes');
    this.citas$ = this.http.get<any[]>('http://localhost:8000/consultas');
    this.expedientes$ = this.http.get<any[]>('http://localhost:8000/expedientes');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
