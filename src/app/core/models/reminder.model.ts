export enum ReminderStatus {
  PENDIENTE = 'PENDIENTE',
  PAGADO = 'PAGADO',
}

export interface Reminder {
  id: string;
  nombre: string;
  valor: number;
  fecha: string;
  hora: string;
  categoria?: string;
  estado: ReminderStatus;
  fechaPago?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderInput {
  nombre: string;
  valor: number;
  fecha: string;
  hora: string;
  categoria?: string;
}
