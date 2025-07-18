// clinic-frontend-primeng/src/app/pages/auth/medico/medico.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { NgIf, AsyncPipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule, TableModule, TabViewModule, ButtonModule, NgIf, NgFor, FormsModule, CardModule,        // ✅ para <p-card>
    AvatarModule,      
    TabViewModule,     
    ButtonModule,      
    TooltipModule,
    ToastModule,
  DialogModule  ],
  providers: [MessageService],
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {
  consultas: any[] = [];
  expedientes: any[] = [];
  consultaSeleccionada: any = null;
  modalVisible: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.recargarConsultas();
    this.recargarExpedientes();
  }

  recargarConsultas() {
    this.http.get<any[]>('http://localhost:8000/medico/consultas').subscribe(data => this.consultas = data || []);
  }

  recargarExpedientes() {
    this.http.get<any[]>('http://localhost:8000/medico/expedientes').subscribe(data => this.expedientes = data || []);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

editarConsulta(consulta: any) {
  this.consultaSeleccionada = { ...consulta };
  this.modalVisible = true;
}

cancelarEdicion() {
  this.modalVisible = false;
  this.consultaSeleccionada = null;
}

guardarEdicionConsulta() {
  const c = this.consultaSeleccionada;

  // Validación de campos obligatorios
  if (!c || !c.horario || !c.tipo || !c.diagnostico || !c.id_paciente || !c.id_consultorio || isNaN(Number(c.costo))) {
    console.warn("🟡 Validación falló con valores:");
    console.log("tipo:", c?.tipo);
    console.log("horario:", c?.horario);
    console.log("diagnostico:", c?.diagnostico);
    console.log("costo:", c?.costo);
    console.log("id_paciente:", c?.id_paciente);
    console.log("id_consultorio:", c?.id_consultorio);

    this.messageService.add({
      severity: 'warn',
      summary: 'Faltan datos',
      detail: 'Por favor completa todos los campos obligatorios',
      life: 4000
    });

    return; 
  }

  const datosActualizados = {
    tipo: c.tipo,
    horario: new Date(c.horario).toISOString(),
    diagnostico: c.diagnostico?.trim() || null,
    costo: Number(c.costo),
    id_consultorio: Number(c.id_consultorio),
    id_paciente: Number(c.id_paciente),
    id_medico: this.authService.getUserId()
  };

  this.http.put(`http://localhost:8000/consultas/${c.id_consulta}`, datosActualizados)
    .subscribe({
      next: res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Consulta actualizada correctamente',
          life: 3000
        });
        this.consultaSeleccionada = null;
        this.modalVisible = false; 
        this.recargarConsultas();
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al actualizar',
          life: 4000
        });
        console.error("❌ ERROR al actualizar:", err);
      }
    });
}
}