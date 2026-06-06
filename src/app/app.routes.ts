import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/reminders',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'reminders',
        loadComponent: () =>
          import('./pages/reminder-list/reminder-list.page').then(m => m.ReminderListPage),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./pages/history/history.page').then(m => m.HistoryPage),
      },
      { path: '', redirectTo: 'reminders', pathMatch: 'full' },
    ],
  },
];
