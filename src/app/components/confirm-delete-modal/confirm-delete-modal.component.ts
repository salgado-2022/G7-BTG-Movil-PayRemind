import { Component, inject } from '@angular/core';
import { IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [IonButton, IonIcon],
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss'],
})
export class ConfirmDeleteModalComponent {
  private readonly modalCtrl = inject(ModalController);

  confirm(): void { this.modalCtrl.dismiss(null, 'confirm'); }
  cancel(): void  { this.modalCtrl.dismiss(null, 'cancel'); }
}
