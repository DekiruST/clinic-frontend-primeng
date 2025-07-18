import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'; 
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EnfermeraService } from '../core/services/enfermera.service';
import { Consulta, Expediente } from '../core/services/modelos';

@Component({
  selector: 'app-dashboard-enfermera',
  standalone: true,
  templateUrl: './dashboard-enfermera.component.html',
  styleUrls: ['./dashboard-enfermera.component.css'],
  imports: [
    CommonModule,
    CardModule,
    AvatarModule,
    TableModule,
    NgIf,
    NgFor,
    ButtonModule,
    ProgressSpinnerModule
  ]
})
export class DashboardEnfermeraComponent implements OnInit {
  citas: Consulta[] = [];
  expedientes: Expediente[] = [];
  cargandoCitas = true;
  cargandoExpedientes = true;

  constructor(private enfermeraService: EnfermeraService) {}

  ngOnInit(): void {
    this.cargarConsultas();
    this.cargarExpedientes();
  }

  cargarConsultas(): void {
    this.enfermeraService.getAllConsultas().subscribe({
      next: data => this.citas = data,
      error: () => this.citas = [],
      complete: () => this.cargandoCitas = false
    });
  }

  cargarExpedientes(): void {
    this.enfermeraService.getAllExpedientes().subscribe({
      next: data => this.expedientes = data,
      error: () => this.expedientes = [],
      complete: () => this.cargandoExpedientes = false
    });
  }

  trackByIdPaciente(index: number, item: Expediente): number {
    return item.id_paciente;
  }
  
  trackById(index: number, item: any): number {
    return item.id_paciente;
  }
}