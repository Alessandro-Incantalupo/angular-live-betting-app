import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/layout.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component'),
      },
      {
        path: 'sport/:sport',
        loadComponent: () => import('./features/home/home.component'),
      },
      {
        path: 'sport/:sport/category/:category',
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
