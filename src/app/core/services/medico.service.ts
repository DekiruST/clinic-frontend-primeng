import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta, Receta, Expediente, ConsultaMedico } from './modelos';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  constructor(private http: HttpClient) {}


getConsultas(): Observable<ConsultaMedico[]> {
  return this.http.get<ConsultaMedico[]>('http://localhost:8000/medico/consultas');
}
getRecetas(): Observable<Receta[]> {
  return this.http.get<Receta[]>('http://localhost:8000/medico/recetas');
}
getExpedientes(): Observable<Expediente[]> {
  return this.http.get<Expediente[]>('http://localhost:8000/medico/expedientes');
}

}
