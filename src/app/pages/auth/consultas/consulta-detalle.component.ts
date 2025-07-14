import { Component, OnInit } from '@angular/core';
import { ConsultaService } from '../../../core/services/consulta.service';

@Component({
  selector: 'app-consulta-detalle',
  templateUrl: './consulta-detalle.component.html'
})
export class ConsultaDetalleComponent implements OnInit {
  consultas: any[] = [];
  medicos: any[] = [];
  consultaId?: number;
  idMedicoSeleccionado?: number;
  mensaje: string = '';

  constructor(private consultaService: ConsultaService) {}

  ngOnInit() {
    this.consultaService.getConsultas().subscribe(data => this.consultas = data);
    this.consultaService.getMedicos().subscribe(data => this.medicos = data);
  }

  asignarMedico() {
    if (!this.consultaId || !this.idMedicoSeleccionado) {
      this.mensaje = 'Selecciona una consulta y un médico.';
      return;
    }
    this.consultaService.asignarMedicoAConsulta(this.consultaId, this.idMedicoSeleccionado).subscribe({
      next: (res) => this.mensaje = '¡Médico asignado correctamente!',
      error: (err) => this.mensaje = 'Error al asignar médico.'
    });
  }
}
