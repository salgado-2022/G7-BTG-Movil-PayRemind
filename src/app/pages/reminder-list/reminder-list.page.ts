import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { StaggerDelayPipe } from '../../core/pipes/stagger-delay.pipe';
import { CategoryColorPipe } from '../../core/pipes/category-color.pipe';
import { CategoryIconPipe } from '../../core/pipes/category-icon.pipe';
import { CategoryBgPipe } from '../../core/pipes/category-bg.pipe';
import {
  IonContent, IonList,
  IonItemSliding, IonItem, IonItemOptions, IonItemOption,
  IonFab, IonFabButton, IonIcon, IonText, IonBadge,
  ModalController, ToastController,
} from '@ionic/angular/standalone';
import { Reminder } from '../../core/models/reminder.model';
import { ReminderService } from '../../core/services/reminder.service';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { ReminderFormModalComponent } from '../../components/reminder-form-modal/reminder-form-modal.component';
import { ConfirmPaymentModalComponent } from '../../components/confirm-payment-modal/confirm-payment-modal.component';
import { ConfirmDeleteModalComponent } from '../../components/confirm-delete-modal/confirm-delete-modal.component';
import { dialogEnterAnimation, dialogLeaveAnimation } from '../../core/animations/dialog.animation';

@Component({
  selector: 'app-reminder-list',
  standalone: true,
  imports: [
    DatePipe, DecimalPipe, StaggerDelayPipe,
    CategoryColorPipe, CategoryIconPipe, CategoryBgPipe,
    AppHeaderComponent,
    IonContent, IonList,
    IonItemSliding, IonItem, IonItemOptions, IonItemOption,
    IonFab, IonFabButton, IonIcon, IonText, IonBadge,
  ],
  templateUrl: './reminder-list.page.html',
  styleUrls: ['./reminder-list.page.scss'],
})
export class ReminderListPage implements OnInit {
  private readonly service   = inject(ReminderService);
  private readonly modalCtrl = inject(ModalController);
  private readonly toastCtrl = inject(ToastController);

  reminders: Reminder[] = [];
  loading = true;

  get totalPending(): number {
    return this.reminders.reduce((sum, r) => sum + r.valor, 0);
  }

  get nextReminder(): Reminder | null {
    return this.reminders[0] ?? null;
  }

  get daysUntilNext(): number | null {
    if (!this.nextReminder) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next = new Date(this.nextReminder.fecha + 'T00:00:00');
    return Math.ceil((next.getTime() - today.getTime()) / 86_400_000);
  }

  get nextPaymentLabel(): string {
    const d = this.daysUntilNext;
    if (d === null) return '';
    if (d === 0) return 'Próximo pago hoy';
    if (d === 1) return 'Próximo pago mañana';
    if (d < 0)  return `Pago vencido hace ${Math.abs(d)} día(s)`;
    return `Próximo pago en ${d} días`;
  }

  async ngOnInit(): Promise<void> {
    await this.loadReminders();
  }

  ionViewWillEnter(): void {
    this.loadReminders();
  }

  async loadReminders(): Promise<void> {
    this.loading = true;
    this.reminders = await this.service.list();
    this.loading = false;
  }

  async openCreateModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ReminderFormModalComponent,
      breakpoints: [0, 0.9, 1],
      initialBreakpoint: 0.9,
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm' && data) {
      await this.service.create(data);
      await this.loadReminders();
      await this.showToast('Recordatorio creado');
    }
  }

  async onEdit(reminder: Reminder, slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    const modal = await this.modalCtrl.create({
      component: ReminderFormModalComponent,
      componentProps: { reminder },
      breakpoints: [0, 0.9, 1],
      initialBreakpoint: 0.9,
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm' && data) {
      await this.service.update(reminder.id, data);
      await this.loadReminders();
      await this.showToast('Recordatorio actualizado');
    }
  }

  async onDelete(id: string, slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    const modal = await this.modalCtrl.create({
      component: ConfirmDeleteModalComponent,
      cssClass: 'pr-dialog',
      enterAnimation: dialogEnterAnimation,
      leaveAnimation: dialogLeaveAnimation,
    });
    await modal.present();
    const { role } = await modal.onDidDismiss();
    if (role === 'confirm') {
      await this.service.delete(id);
      await this.loadReminders();
      await this.showToast('Recordatorio eliminado');
    }
  }

  async onMarkAsPaid(reminder: Reminder, slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    const modal = await this.modalCtrl.create({
      component: ConfirmPaymentModalComponent,
      componentProps: { reminder },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });
    await modal.present();
    const { role } = await modal.onDidDismiss();
    if (role === 'confirm') {
      await this.service.markAsPaid(reminder.id);
      await this.loadReminders();
      await this.showToast('¡Pago registrado con éxito!');
    }
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }
}
