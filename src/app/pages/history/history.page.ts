import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { IonContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { AppHeaderComponent } from '../../components/app-header/app-header.component';
import { CategoryIconPipe } from '../../core/pipes/category-icon.pipe';
import { CategoryColorPipe } from '../../core/pipes/category-color.pipe';
import { CategoryBgPipe } from '../../core/pipes/category-bg.pipe';
import { Reminder } from '../../core/models/reminder.model';
import { ReminderService } from '../../core/services/reminder.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    DatePipe, DecimalPipe, UpperCasePipe,
    AppHeaderComponent,
    CategoryIconPipe, CategoryColorPipe, CategoryBgPipe,
    IonContent, IonIcon, IonText,
  ],
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  private readonly service = inject(ReminderService);

  paid: Reminder[] = [];

  // ── Month helpers ────────────────────────────────────────
  private get thisMonthStart(): Date {
    const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d;
  }
  private get lastMonthStart(): Date {
    const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0);
    d.setMonth(d.getMonth() - 1); return d;
  }

  // ── Stats ────────────────────────────────────────────────
  get totalPaidThisMonth(): number {
    const s = this.thisMonthStart;
    return this.paid
      .filter(r => r.fechaPago && new Date(r.fechaPago) >= s)
      .reduce((sum, r) => sum + r.valor, 0);
  }

  get paymentCountThisMonth(): number {
    const s = this.thisMonthStart;
    return this.paid.filter(r => r.fechaPago && new Date(r.fechaPago) >= s).length;
  }

  get totalPaidLastMonth(): number {
    const s = this.lastMonthStart;
    const e = this.thisMonthStart;
    return this.paid
      .filter(r => r.fechaPago && new Date(r.fechaPago) >= s && new Date(r.fechaPago) < e)
      .reduce((sum, r) => sum + r.valor, 0);
  }

  get vsLastMonthPercent(): number {
    const last = this.totalPaidLastMonth;
    if (last === 0) return 0;
    return Math.round(((this.totalPaidThisMonth - last) / last) * 100);
  }

  get punctualityRate(): number {
    if (this.paid.length === 0) return 100;
    const onTime = this.paid.filter(
      r => r.fechaPago && r.fechaPago.split('T')[0] <= r.fecha
    ).length;
    return Math.round((onTime / this.paid.length) * 100);
  }

  async ngOnInit(): Promise<void> {
    this.paid = await this.service.listPaid();
  }

  async ionViewWillEnter(): Promise<void> {
    this.paid = await this.service.listPaid();
  }
}
