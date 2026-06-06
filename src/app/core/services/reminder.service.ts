import { inject, Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Reminder, ReminderInput, ReminderStatus } from '../models/reminder.model';
import { ReminderRepository } from '../repositories/reminder.repository';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class ReminderService {
  private readonly repo  = inject(ReminderRepository);
  private readonly notif = inject(NotificationService);

  async list(): Promise<Reminder[]> {
    const all = await this.repo.findAll();
    return all
      .filter(r => r.estado === ReminderStatus.PENDIENTE)
      .sort((a, b) =>
        `${a.fecha}T${a.hora}`.localeCompare(`${b.fecha}T${b.hora}`)
      );
  }

  async listPaid(): Promise<Reminder[]> {
    const all = await this.repo.findAll();
    return all
      .filter(r => r.estado === ReminderStatus.PAGADO)
      .sort((a, b) => (b.fechaPago ?? '').localeCompare(a.fechaPago ?? ''));
  }

  async create(input: ReminderInput): Promise<Reminder> {
    const now = new Date().toISOString();
    const reminder: Reminder = {
      id: uuidv4(),
      ...input,
      estado: ReminderStatus.PENDIENTE,
      createdAt: now,
      updatedAt: now,
    };
    await this.repo.save(reminder);
    await this.notif.schedule(reminder);
    return reminder;
  }

  async update(id: string, input: ReminderInput): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) return;
    const updated: Reminder = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    await this.repo.update(updated);
    await this.notif.reschedule(updated);
  }

  async delete(id: string): Promise<void> {
    await this.notif.cancel(id);
    await this.repo.delete(id);
  }

  async markAsPaid(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) return;
    const updated: Reminder = {
      ...existing,
      estado: ReminderStatus.PAGADO,
      fechaPago: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await this.repo.update(updated);
    await this.notif.cancel(id);
  }
}
