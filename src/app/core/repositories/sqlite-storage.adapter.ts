import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Reminder } from '../models/reminder.model';
import { StorageAdapter } from './storage.adapter';

const DB_NAME = 'payremind';

const DDL = `
  CREATE TABLE IF NOT EXISTS reminders (
    id          TEXT PRIMARY KEY,
    nombre      TEXT NOT NULL,
    valor       REAL NOT NULL,
    fecha       TEXT NOT NULL,
    hora        TEXT NOT NULL,
    categoria   TEXT,
    estado      TEXT NOT NULL DEFAULT 'PENDIENTE',
    fecha_pago  TEXT,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_estado ON reminders (estado);
  CREATE INDEX IF NOT EXISTS idx_fecha  ON reminders (fecha, hora);
`;

@Injectable()
export class SqliteStorageAdapter extends StorageAdapter {
  private readonly sqlite = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;

  async init(): Promise<void> {
    const isConn = await this.sqlite.isConnection(DB_NAME, false);
    this.db = isConn.result
      ? await this.sqlite.retrieveConnection(DB_NAME, false)
      : await this.sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false);
    await this.db.open();
    await this.db.execute(DDL);
    // migration: add categoria column if it doesn't exist yet
    try { await this.db.execute('ALTER TABLE reminders ADD COLUMN categoria TEXT'); } catch { /* already exists */ }
  }

  async findAll(): Promise<Reminder[]> {
    const res = await this.db.query(
      'SELECT * FROM reminders ORDER BY fecha ASC, hora ASC'
    );
    return (res.values ?? []).map(this.rowToReminder);
  }

  async findById(id: string): Promise<Reminder | null> {
    const res = await this.db.query('SELECT * FROM reminders WHERE id = ?', [id]);
    const row = res.values?.[0];
    return row ? this.rowToReminder(row) : null;
  }

  async save(reminder: Reminder): Promise<void> {
    await this.db.run(
      `INSERT INTO reminders
         (id,nombre,valor,fecha,hora,categoria,estado,fecha_pago,created_at,updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        reminder.id, reminder.nombre, reminder.valor,
        reminder.fecha, reminder.hora, reminder.categoria ?? null,
        reminder.estado, reminder.fechaPago ?? null,
        reminder.createdAt, reminder.updatedAt,
      ]
    );
  }

  async update(reminder: Reminder): Promise<void> {
    await this.db.run(
      `UPDATE reminders
       SET nombre=?,valor=?,fecha=?,hora=?,categoria=?,estado=?,fecha_pago=?,updated_at=?
       WHERE id=?`,
      [
        reminder.nombre, reminder.valor, reminder.fecha, reminder.hora,
        reminder.categoria ?? null, reminder.estado,
        reminder.fechaPago ?? null, reminder.updatedAt,
        reminder.id,
      ]
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.run('DELETE FROM reminders WHERE id = ?', [id]);
  }

  private rowToReminder(row: Record<string, unknown>): Reminder {
    return {
      id:         row['id'] as string,
      nombre:     row['nombre'] as string,
      valor:      row['valor'] as number,
      fecha:      row['fecha'] as string,
      hora:       row['hora'] as string,
      categoria:  row['categoria'] as string | undefined,
      estado:     row['estado'] as Reminder['estado'],
      fechaPago:  row['fecha_pago'] as string | undefined,
      createdAt:  row['created_at'] as string,
      updatedAt:  row['updated_at'] as string,
    };
  }
}
