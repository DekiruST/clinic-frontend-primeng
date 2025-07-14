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

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule, TableModule, TabViewModule, ButtonModule, NgIf, NgFor, FormsModule],
  templateUrl: './medico.component.html',
  styleUrls: []
})
export class MedicoComponent implements OnInit {
  consultas: any[] = [];
  expedientes: any[] = [];
  consultaSeleccionada: any = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
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
    this.consultaSeleccionada = { ...consulta }; // clona para editar
  }

  cancelarEdicion() {
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
    alert("Faltan datos obligatorios o hay datos inválidos.");
    return;
  }

  // Construcción del objeto limpio a enviar
const datosActualizados = {
  tipo: c.tipo,
  horario: new Date(c.horario).toISOString(),
  diagnostico: c.diagnostico?.trim() || null,
  costo: Number(c.costo),
  id_consultorio: Number(c.id_consultorio),
  id_paciente: Number(c.id_paciente),
  id_medico: this.authService.getUserId()
};


  // Log de depuración final
  console.log("✅ Enviando al backend:", datosActualizados);

  // Envío de la solicitud PUT
  this.http.put(`http://localhost:8000/consultas/${c.id_consulta}`, datosActualizados)
    .subscribe({
      next: res => {
        alert("Consulta actualizada.");
        this.consultaSeleccionada = null;
        this.recargarConsultas();
      },
      error: err => {
        alert("Ocurrió un error al actualizar.");
        console.error("❌ ERROR al actualizar:", err);
      }
    });
}



}
