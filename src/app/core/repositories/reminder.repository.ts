import { inject, Injectable } from '@angular/core';
import { Reminder } from '../models/reminder.model';
import { StorageAdapter } from './storage.adapter';

@Injectable({ providedIn: 'root' })
export class ReminderRepository {
  private readonly adapter = inject(StorageAdapter);

  init(): Promise<void>                           { return this.adapter.init(); }
  findAll(): Promise<Reminder[]>                  { return this.adapter.findAll(); }
  findById(id: string): Promise<Reminder | null>  { return this.adapter.findById(id); }
  save(reminder: Reminder): Promise<void>         { return this.adapter.save(reminder); }
  update(reminder: Reminder): Promise<void>       { return this.adapter.update(reminder); }
  delete(id: string): Promise<void>               { return this.adapter.delete(id); }
}
