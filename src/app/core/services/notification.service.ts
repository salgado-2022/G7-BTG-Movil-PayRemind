import { inject, Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Reminder } from '../models/reminder.model';
import { PlatformService } from './platform.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly platform = inject(PlatformService);

  async requestPermission(): Promise<void> {
    if (!this.platform.isNative()) return;
    await LocalNotifications.requestPermissions();
  }

  async schedule(reminder: Reminder): Promise<void> {
    if (!this.platform.isNative()) return;
    await LocalNotifications.schedule({
      notifications: [{
        id:    this.toIntId(reminder.id),
        title: 'PayRemind',
        body:  `${reminder.nombre} — $${reminder.valor.toLocaleString('es-CO')}`,
        schedule: { at: new Date(`${reminder.fecha}T${reminder.hora}:00`) },
        smallIcon: 'ic_stat_icon_config_sample',
        extra: { reminderId: reminder.id },
      }],
    });
  }

  async cancel(reminderId: string): Promise<void> {
    if (!this.platform.isNative()) return;
    await LocalNotifications.cancel({
      notifications: [{ id: this.toIntId(reminderId) }],
    });
  }

  async reschedule(reminder: Reminder): Promise<void> {
    await this.cancel(reminder.id);
    await this.schedule(reminder);
  }

  private toIntId(uuid: string): number {
    let h = 0;
    for (let i = 0; i < uuid.length; i++) {
      h = (Math.imul(31, h) + uuid.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }
}
