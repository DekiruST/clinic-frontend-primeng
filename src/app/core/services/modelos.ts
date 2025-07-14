// clinic-frontend-primeng/src/app/core/services/modelos.ts
export interface Paciente {
  id_paciente: number;
  nombre: string;
  seguro?: string;
  contacto: string;
}

export interface Consulta {
  estado: string;
  id_consulta: number;
  tipo: string;
  horario: string;
  diagnostico?: string;
  costo?: number;
  id_consultorio: number;
  id_paciente: number;
  id_medico?: number | null;
  nombreMedico?: string; // ✅ agrega este campo opcional
}



export interface DetalleReceta {
  id_detalle: number;
  medicamento: string;
  dosis: string;
}

export interface Receta {
  id_receta: number;
  fecha: string;
  id_consulta: number;
  detalles: DetalleReceta[];
}

export interface Medico {
  id_usuario: number;
  nombre: string;
  especialidad: string;
  contacto: string;
}

export interface Expediente {
  ultima_actualizacion: Date;
  id_expediente: number;
  antecedentes: string;
  historial_clinico: string;
  id_paciente: number;
}

export interface ConsultaMedico {
  id_consulta: number;
  id_paciente: number;
  id_consultorio: number;
  paciente: string;
  motivo: string;
  fecha: string;
  tipo: string;
}



