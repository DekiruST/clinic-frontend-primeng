import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'; // Nuevo para potenciales acciones
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
    ButtonModule // Nuevo
  ]
})
export class DashboardEnfermeraComponent implements OnInit {
  citas: Consulta[] = [];
  expedientes: Expediente[] = [];
  cargandoCitas = true;
  cargandoExpedientes = true;

  constructor(private enfermeraService: EnfermeraService) {}

  ngOnInit(): void {
    this.enfermeraService.getAllConsultas().subscribe({
      next: data => this.citas = data,
      error: () => this.citas = [],
      complete: () => this.cargandoCitas = false
    });

    this.enfermeraService.getAllExpedientes().subscribe({
      next: data => this.expedientes = data,
      error: () => this.expedientes = [],
      complete: () => this.cargandoExpedientes = false
    });
  }
}
