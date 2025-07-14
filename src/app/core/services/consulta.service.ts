//clinic-frontend-primeng/src/app/core/services/consulta.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta } from './modelos';


export interface Medico {
  id_usuario: number;
  nombre: string;
  especialidad?: string;
  contacto?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private API_URL = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Obtener todas las consultas (puedes filtrar por no asignadas si lo deseas)
  getConsultas(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.API_URL}/consultas`);
  }

  // Obtener todos los médicos
  getMedicos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(`${this.API_URL}/medicos`);
  }

  // Asignar médico a una consulta
  asignarMedicoAConsulta(idConsulta: number, idUsuario: number): Observable<any> {
    return this.http.put(`${this.API_URL}/consultas/${idConsulta}/asignar-medico`, { id_usuario: idUsuario });
  }

}
