import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline, checkmarkOutline, pencilOutline, trashOutline,
  cashOutline, listOutline, timeOutline, calendarOutline,
  checkmarkCircle, checkmarkCircleOutline, notificationsOutline, alertCircleOutline,
  closeOutline, cardOutline, trendingDownOutline, trendingUpOutline,
  personCircleOutline, documentTextOutline, arrowBackOutline,
  helpCircleOutline, menuOutline, searchOutline, globeOutline,
  homeOutline, cartOutline, heartOutline, carOutline,
  musicalNotesOutline, funnelOutline,
} from 'ionicons/icons';
import { ReminderRepository } from './core/repositories/reminder.repository';
import { NotificationService } from './core/services/notification.service';
import { ReminderService } from './core/services/reminder.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `<ion-app><ion-router-outlet></ion-router-outlet></ion-app>`,
})
export class AppComponent implements OnInit {
  private readonly repo      = inject(ReminderRepository);
  private readonly notif     = inject(NotificationService);
  private readonly reminders = inject(ReminderService);

  constructor() {
    addIcons({
      addOutline, checkmarkOutline, pencilOutline, trashOutline,
      cashOutline, listOutline, timeOutline, calendarOutline,
      checkmarkCircle, checkmarkCircleOutline, notificationsOutline, alertCircleOutline,
      closeOutline, cardOutline, trendingDownOutline, trendingUpOutline,
      personCircleOutline, documentTextOutline, arrowBackOutline,
      helpCircleOutline, menuOutline, searchOutline, globeOutline,
      homeOutline, cartOutline, heartOutline, carOutline,
      musicalNotesOutline, funnelOutline,
    });
  }

  async ngOnInit(): Promise<void> {
    await this.repo.init();
    await this.notif.requestPermission();
    // En web los timers de setTimeout se pierden al recargar: reprograma los pendientes.
    // En nativo es no-op (las notificaciones persisten en el sistema operativo).
    const pendientes = await this.reminders.list();
    await this.notif.rescheduleAllForWeb(pendientes);
  }
}
