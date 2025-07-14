import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { Paciente, Consulta, Receta } from '../core/services/modelos';
import { PacienteService } from '../core/services/paciente.service';

@Component({
  selector: 'app-dashboard-paciente',
  standalone: true,
  templateUrl: './dashboard-paciente.component.html',
  styleUrls: ['./dashboard-paciente.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    ProgressSpinnerModule
  ]
})
export class DashboardPacienteComponent implements OnInit {
  paciente: Paciente | undefined;
  citas: Consulta[] = [];
  citasProximas: Consulta[] = [];
  historialCitas: Consulta[] = [];
  recetas: Receta[] = [];

  cargando = true;
  mensajeCita: string | null = null;
  mostrarFormularioCita = false;

  tiposCita = [
    { label: 'General', value: 'general' },
    { label: 'Especialidad', value: 'especialidad' },
    { label: 'Urgencia', value: 'urgencia' },
    { label: 'Control', value: 'control' }
  ];

  nuevaCita: Partial<Consulta> = {
    tipo: '',
    horario: ''
  };

  constructor(private pacienteService: PacienteService) {}

  ngOnInit() {
    this.cargarDatosPaciente();
  }

  private cargarDatosPaciente() {
    this.cargando = true;

    this.pacienteService.getPacienteActual().subscribe({
      next: paciente => {
        this.paciente = paciente;
        this.cargarCitas(paciente);
        this.cargarRecetas(paciente.id_paciente);
      },
      error: () => this.limpiarDatos()
    });
  }

  private cargarCitas(paciente: Paciente) {
    this.pacienteService.getCitasPacienteDesdeToken().subscribe({
      next: citas => {
        this.citas = citas || [];
        this.organizarCitas();
      },
      error: () => this.limpiarCitas(),
      complete: () => this.cargando = false
    });
  }

  private cargarRecetas(idPaciente: number) {
    this.pacienteService.getRecetasPaciente(idPaciente).subscribe({
      next: recetas => this.recetas = recetas || [],
      error: () => this.recetas = []
    });
  }

  private organizarCitas() {
    const ahora = Date.now();
    this.citasProximas = this.citas
      .filter(c => Date.parse(c.horario) > ahora)
      .sort((a, b) => Date.parse(a.horario) - Date.parse(b.horario));

    this.historialCitas = this.citas
      .filter(c => Date.parse(c.horario) <= ahora)
      .sort((a, b) => Date.parse(b.horario) - Date.parse(a.horario));
  }

  private limpiarDatos() {
    this.paciente = undefined;
    this.limpiarCitas();
    this.recetas = [];
    this.cargando = false;
  }

  private limpiarCitas() {
    this.citas = [];
    this.citasProximas = [];
    this.historialCitas = [];
  }

  abrirFormularioCita() {
    this.mostrarFormularioCita = true;
    this.nuevaCita = { tipo: '', horario: '' };
  }

  cerrarFormularioCita() {
    this.mostrarFormularioCita = false;
  }

  agendarCita() {
    if (!this.paciente || !this.nuevaCita.tipo || !this.nuevaCita.horario) {
      this.mensajeCita = "Debes completar todos los campos.";
      setTimeout(() => this.mensajeCita = null, 3000);
      return;
    }

    const cita = {
      tipo: this.nuevaCita.tipo,
      horario: new Date(this.nuevaCita.horario).toISOString(),
      id_paciente: this.paciente.id_paciente,
      id_consultorio: this.nuevaCita.tipo === 'especialidad' ? 2 : 1
    };

    this.pacienteService.agendarCita(cita).subscribe({
      next: () => {
        this.cargarDatosPaciente();
        this.cerrarFormularioCita();
      },
      error: () => {
        this.mensajeCita = "❌ Error al agendar la cita.";
        setTimeout(() => this.mensajeCita = null, 3000);
      }
    });
  }
  
}
