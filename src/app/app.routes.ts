import { Routes } from '@angular/router';
import { APP_ROUTES } from './core/constants/routes.constants';

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
        path: `${APP_ROUTES.BETS}/:sport`,
        loadComponent: () => import('./features/home/home.component'),
      },
      {
        path: `${APP_ROUTES.BETS}/:sport/:category`,
        loadComponent: () => import('./features/home/home.component'),
      },
      {
        path: `${APP_ROUTES.BETS}/:sport/:category/:id`,
        loadComponent: () =>
          import('./features/event-detail/event-detail.component'),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
