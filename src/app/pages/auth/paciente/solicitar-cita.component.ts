import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitar-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitar-cita.component.html'
})
export class SolicitarCitaComponent {
  citaForm: FormGroup;
  mensaje = '';
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.citaForm = this.fb.group({
      paciente_id: [user?.id_paciente || '', Validators.required],
      especialidad: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha_preferente: ['', Validators.required]
    });
  }

  solicitarCita() {
    const token = localStorage.getItem('access_token');
    this.http.post('http://localhost:8000/citas/solicitar', this.citaForm.value, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        this.mensaje = 'Cita solicitada exitosamente';
        setTimeout(() => this.router.navigate(['/dashboard/paciente']), 1500);
      },
      error: (err) => {
        this.mensaje = err.error?.message || 'Error al solicitar la cita';
      }
    });
  }
}
