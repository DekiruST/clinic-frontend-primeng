// src/app/pages/auth/enfermera/enfermera.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { Observable, map } from 'rxjs';
import { NgIf, AsyncPipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


// Interfaces tipadas
interface Paciente {
  id_paciente: number;
  nombre: string;
  seguro: string;
  contacto: string;
}

interface Cita {
  id_consulta: number;
  tipo: string;
  horario: string;
  diagnostico?: string;
  id_consultorio: number;
  id_paciente: number;
  id_medico?: number;
  nombreMedico?: string;
}

interface Expediente {
  id_expediente: number;
  antecedentes: string;
  historial_clinico: string;
  id_paciente: number;
}

@Component({
  selector: 'app-enfermera',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TabViewModule,
    ButtonModule,
    ToastModule,         
    NgIf,
    AsyncPipe
  ],
  providers: [MessageService], 
  templateUrl: './enfermera.component.html',
  styleUrls: ['./enfermera.component.css']
})

export class EnfermeraComponent implements OnInit {
  pacientes$!: Observable<Paciente[]>;
  citas$!: Observable<Cita[]>;
  expedientes$!: Observable<Expediente[]>;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pacientes$ = this.http.get<Paciente[]>('http://localhost:8000/enfermera/pacientes');
    this.citas$ = this.http.get<Cita[]>('http://localhost:8000/consultas');
    this.expedientes$ = this.http.get<Expediente[]>('http://localhost:8000/expedientes');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
