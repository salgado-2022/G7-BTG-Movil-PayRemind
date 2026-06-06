import { Component, Input, OnInit, inject } from '@angular/core';
import {
  AbstractControl, FormControl, FormGroup,
  ReactiveFormsModule, ValidationErrors, Validators,
} from '@angular/forms';
import {
  IonContent, IonButton, IonIcon, ModalController,
} from '@ionic/angular/standalone';
import { Reminder, ReminderInput } from '../../core/models/reminder.model';

function futureDateValidator(ctrl: AbstractControl): ValidationErrors | null {
  const today = new Date().toISOString().split('T')[0];
  return ctrl.value && ctrl.value < today ? { pastDate: true } : null;
}

@Component({
  selector: 'app-reminder-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, IonContent, IonButton, IonIcon],
  templateUrl: './reminder-form-modal.component.html',
  styleUrls: ['./reminder-form-modal.component.scss'],
})
export class ReminderFormModalComponent implements OnInit {
  @Input() reminder?: Reminder;

  private readonly modalCtrl = inject(ModalController);

  readonly today = new Date().toISOString().split('T')[0];
  readonly categories = ['Servicios', 'Hogar', 'Compras', 'Salud', 'Ocio'];

  displayValor = '';

  form!: FormGroup<{
    nombre:    FormControl<string | null>;
    valor:     FormControl<number | null>;
    categoria: FormControl<string | null>;
    fecha:     FormControl<string | null>;
    hora:      FormControl<string | null>;
  }>;

  get mode(): 'create' | 'edit' { return this.reminder ? 'edit' : 'create'; }

  get nombreCtrl()    { return this.form.get('nombre')!; }
  get valorCtrl()     { return this.form.get('valor')!; }
  get categoriaCtrl() { return this.form.get('categoria')!; }
  get fechaCtrl()     { return this.form.get('fecha')!; }
  get horaCtrl()      { return this.form.get('hora')!; }

  ngOnInit(): void {
    this.form = new FormGroup({
      nombre: new FormControl(this.reminder?.nombre ?? '', [
        Validators.required, Validators.maxLength(60),
      ]),
      valor: new FormControl<number | null>(this.reminder?.valor ?? null, [
        Validators.required, Validators.min(1),
      ]),
      categoria: new FormControl(this.reminder?.categoria ?? null),
      fecha: new FormControl(this.reminder?.fecha ?? '', [
        Validators.required, futureDateValidator,
      ]),
      hora: new FormControl(this.reminder?.hora ?? '', Validators.required),
    });

    if (this.reminder?.valor) {
      this.displayValor = new Intl.NumberFormat('es-CO').format(this.reminder.valor);
    }
  }

  formatValor(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, '');

    if (!raw) {
      input.value = '';
      this.displayValor = '';
      this.valorCtrl.setValue(null);
      this.valorCtrl.markAsTouched();
      return;
    }

    const num = parseInt(raw, 10);
    const formatted = new Intl.NumberFormat('es-CO').format(num);
    input.value = formatted;
    this.displayValor = formatted;
    this.valorCtrl.setValue(num);
  }

  selectCategory(cat: string): void {
    const current = this.categoriaCtrl.value;
    this.categoriaCtrl.setValue(current === cat ? null : cat);
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { nombre, valor, categoria, fecha, hora } = this.form.value;
    const input: ReminderInput = {
      nombre: nombre!,
      valor: Number(valor),
      fecha: fecha!,
      hora: hora!,
      ...(categoria ? { categoria } : {}),
    };
    this.modalCtrl.dismiss(input, 'confirm');
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
