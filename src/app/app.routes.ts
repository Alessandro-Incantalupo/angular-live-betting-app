import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/events-list/events-list'),
  },
  {
    path: 'sports/:sport',
    loadComponent: () => import('./features/events-list/events-list'),
  },
  {
    path: 'sports/:sport/:category',
    loadComponent: () => import('./features/events-list/events-list'),
  },
  {
    path: 'events/:id',
    loadComponent: () => import('./features/event-detail/event-detail'),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found'),
  },
];
