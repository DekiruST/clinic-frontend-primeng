// src/app/core/services/enfermera.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta, Expediente } from './modelos'; 

@Injectable({
  providedIn: 'root'
})
export class EnfermeraService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getAllConsultas(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.apiUrl}/consultas`);
  }

  getAllExpedientes(): Observable<Expediente[]> {
    return this.http.get<Expediente[]>(`${this.apiUrl}/expedientes`);
  }
}
