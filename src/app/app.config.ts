import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { routes } from './app.routes';
import { StorageAdapter } from './core/repositories/storage.adapter';
import { SqliteStorageAdapter } from './core/repositories/sqlite-storage.adapter';
import { LocalStorageAdapter } from './core/repositories/local-storage.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular({ mode: 'md' }),
    {
      provide: StorageAdapter,
      useFactory: () =>
        Capacitor.isNativePlatform()
          ? new SqliteStorageAdapter()
          : new LocalStorageAdapter(),
    },
  ],
};
