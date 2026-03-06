import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/layout.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component'),
      },
      {
        path: 'event/:id',
        loadComponent: () =>
          import('./features/event-detail/event-detail.component'),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
