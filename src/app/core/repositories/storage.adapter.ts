import { Reminder } from '../models/reminder.model';

export abstract class StorageAdapter {
  abstract init(): Promise<void>;
  abstract findAll(): Promise<Reminder[]>;
  abstract findById(id: string): Promise<Reminder | null>;
  abstract save(reminder: Reminder): Promise<void>;
  abstract update(reminder: Reminder): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
