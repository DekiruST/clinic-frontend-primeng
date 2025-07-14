import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente, Consulta, Receta } from './modelos'; 

@Injectable({ providedIn: 'root' })
export class PacienteService {
  api: any;
    getAllConsultas() {
        throw new Error('Method not implemented.');
    }
  private API_URL = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getPacienteActual(): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.API_URL}/pacientes/me`);
  }

  getCitasPaciente(): Observable<Consulta[]> {
  return this.http.get<Consulta[]>(`${this.API_URL}/pacientes/consultas`);
}

getRecetasPaciente(id_paciente: number): Observable<Receta[]> {
  return this.http.get<Receta[]>(`${this.API_URL}/recetas/paciente/${id_paciente}`);
}

  agendarCita(cita: any): Observable<any> {
    return this.http.post(`${this.API_URL}/consultas`, cita);
  }
getCitasPacienteDesdeToken(): Observable<Consulta[]> {
  return this.http.get<Consulta[]>('http://localhost:8000/consultas/paciente');
}
}
