import { Component, Input, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonButtons, IonButton, IonTitle,
  IonContent, IonIcon, ModalController,
} from '@ionic/angular/standalone';
import { Reminder } from '../../core/models/reminder.model';
import { CategoryColorPipe } from '../../core/pipes/category-color.pipe';
import { CategoryIconPipe } from '../../core/pipes/category-icon.pipe';
import { CategoryBgPipe } from '../../core/pipes/category-bg.pipe';

@Component({
  selector: 'app-confirm-payment-modal',
  standalone: true,
  imports: [
    DatePipe, DecimalPipe,
    CategoryColorPipe, CategoryIconPipe, CategoryBgPipe,
    IonHeader, IonToolbar, IonButtons, IonButton, IonTitle,
    IonContent, IonIcon,
  ],
  templateUrl: './confirm-payment-modal.component.html',
  styleUrls: ['./confirm-payment-modal.component.scss'],
})
export class ConfirmPaymentModalComponent {
  @Input() reminder!: Reminder;

  private readonly modalCtrl = inject(ModalController);

  get dueLabel(): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(this.reminder.fecha + 'T00:00:00');
    const diff = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
    if (diff < 0)  return `Vencido hace ${Math.abs(diff)} día(s)`;
    if (diff === 0) return 'Vence hoy';
    if (diff === 1) return 'Vence mañana';
    return `Vence en ${diff} días`;
  }

  get isOverdue(): boolean {
    return new Date(this.reminder.fecha + 'T00:00:00') < new Date(new Date().toDateString());
  }

  confirm(): void { this.modalCtrl.dismiss(null, 'confirm'); }
  cancel():  void { this.modalCtrl.dismiss(null, 'cancel'); }
}
