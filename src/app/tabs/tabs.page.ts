import { Component } from '@angular/core';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="reminders" href="/tabs/reminders">
          <ion-icon name="list-outline"></ion-icon>
          <ion-label>Recordatorios</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="history" href="/tabs/history">
          <ion-icon name="time-outline"></ion-icon>
          <ion-label>Histórico</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    ion-tab-bar {
      --background: #ffffff;
      --border: none;
      border-top: 1px solid #E2E8F0;
      box-shadow: 0 -2px 12px rgba(11, 28, 48, 0.06);
    }
    ion-tab-button {
      --color: #737686;
      --color-selected: #2563EB;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 500;
    }
  `],
})
export class TabsPage {}
