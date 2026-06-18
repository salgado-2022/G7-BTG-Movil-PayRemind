import { inject, Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Reminder } from '../models/reminder.model';
import { PlatformService } from './platform.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly platform = inject(PlatformService);

  /** Timers del fallback web (clave = id del recordatorio). Solo se usan en navegador. */
  private readonly webTimers = new Map<string, number>();

  async requestPermission(): Promise<void> {
    if (this.platform.isNative()) {
      await LocalNotifications.requestPermissions();
      return;
    }
    // Fallback web: permiso del navegador (Web Notifications API).
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  async schedule(reminder: Reminder): Promise<void> {
    if (this.platform.isNative()) {
      await LocalNotifications.schedule({
        notifications: [{
          id:    this.toIntId(reminder.id),
          title: 'PayRemind',
          body:  this.buildBody(reminder),
          schedule: { at: this.scheduledAt(reminder) },
          extra: { reminderId: reminder.id },
        }],
      });
      return;
    }
    // Fallback web: solo dispara con la pestaña abierta (setTimeout + Web Notifications API).
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const delay = this.scheduledAt(reminder).getTime() - Date.now();
    if (delay <= 0) return;                          // la fecha/hora ya pasó
    this.clearWebTimer(reminder.id);                 // evita timers duplicados
    const handle = window.setTimeout(() => {
      new Notification('PayRemind', { body: this.buildBody(reminder) });
      this.webTimers.delete(reminder.id);
    }, delay);
    this.webTimers.set(reminder.id, handle);
  }

  async cancel(reminderId: string): Promise<void> {
    if (this.platform.isNative()) {
      await LocalNotifications.cancel({
        notifications: [{ id: this.toIntId(reminderId) }],
      });
      return;
    }
    this.clearWebTimer(reminderId);
  }

  async reschedule(reminder: Reminder): Promise<void> {
    await this.cancel(reminder.id);
    await this.schedule(reminder);
  }

  /**
   * Reprograma una lista de recordatorios pendientes. Necesario en web porque los
   * timers de setTimeout se pierden al recargar la página. En nativo es no-op: las
   * notificaciones ya persisten en el sistema operativo (AlarmManager).
   */
  async rescheduleAllForWeb(reminders: Reminder[]): Promise<void> {
    if (this.platform.isNative()) return;
    for (const reminder of reminders) {
      await this.schedule(reminder);
    }
  }

  private buildBody(reminder: Reminder): string {
    return `${reminder.nombre} — $${reminder.valor.toLocaleString('es-CO')}`;
  }

  private scheduledAt(reminder: Reminder): Date {
    return new Date(`${reminder.fecha}T${reminder.hora}:00`);
  }

  private clearWebTimer(reminderId: string): void {
    const handle = this.webTimers.get(reminderId);
    if (handle !== undefined) {
      clearTimeout(handle);
      this.webTimers.delete(reminderId);
    }
  }

  private toIntId(uuid: string): number {
    let h = 0;
    for (let i = 0; i < uuid.length; i++) {
      h = (Math.imul(31, h) + uuid.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }
}
