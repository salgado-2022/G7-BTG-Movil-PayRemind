import { Injectable } from '@angular/core';
import { Reminder } from '../models/reminder.model';
import { StorageAdapter } from './storage.adapter';

const STORAGE_KEY = 'payremind:reminders';

@Injectable()
export class LocalStorageAdapter extends StorageAdapter {

  async init(): Promise<void> {}

  async findAll(): Promise<Reminder[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Reminder[];
  }

  async findById(id: string): Promise<Reminder | null> {
    const all = await this.findAll();
    return all.find(r => r.id === id) ?? null;
  }

  async save(reminder: Reminder): Promise<void> {
    const all = await this.findAll();
    all.push(reminder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  async update(reminder: Reminder): Promise<void> {
    const all = await this.findAll();
    const idx = all.findIndex(r => r.id === reminder.id);
    if (idx !== -1) {
      all[idx] = reminder;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
  }

  async delete(id: string): Promise<void> {
    const all = await this.findAll();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all.filter(r => r.id !== id)));
  }
}
