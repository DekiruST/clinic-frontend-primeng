// clinic-frontend-primeng/src/app/dashboards/dashboard-medico.component.ts
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { TabViewModule } from "primeng/tabview";
import { MedicoService } from "../core/services/medico.service";
import { ConsultaMedico, Receta, Expediente } from "../core/services/modelos";
import { AvatarModule } from "primeng/avatar";
import { CardModule } from "primeng/card";

@Component({
  selector: 'app-dashboard-medico',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    AvatarModule,
    TabViewModule,      // ✅ FALTABA ESTE
    NgIf,
    NgFor
  ],
  templateUrl: './dashboard-medico.component.html',
  styleUrls: ['./dashboard-medico.component.css']
})
export class DashboardMedicoComponent implements OnInit {
  citas: ConsultaMedico[] = [];
  recetas: Receta[] = [];
  expedientes: Expediente[] = [];

  constructor(private medicoService: MedicoService) {}

  ngOnInit() {
    this.medicoService.getConsultas().subscribe({
      next: data => this.citas = data,
      error: () => this.citas = []
    });
    this.medicoService.getRecetas().subscribe({
      next: data => this.recetas = data,
      error: () => this.recetas = []
    });
    this.medicoService.getExpedientes().subscribe({
      next: data => this.expedientes = data,
      error: () => this.expedientes = []
    });
  }
}
