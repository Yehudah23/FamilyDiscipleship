import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./hero/hero').then(m => m.Hero) },
  { path: 'discplers', loadComponent: () => import('./discplers/discplers').then(m => m.Discplers) },
  { path: 'admin', loadComponent: () => import('./admin/admin').then(m => m.Admin) },
  { path: 'messages', loadComponent: () => import('./messages/messages').then(m => m.Messages) },
  { path: 'blogs', loadComponent: () => import('./blog/blog').then(m => m.BlogComponent) },
  { path: 'programs', loadComponent: () => import('./programs/programs').then(m => m.Programs) },
  { path: 'about', loadComponent: () => import('./about/about').then(m => m.About) }
];