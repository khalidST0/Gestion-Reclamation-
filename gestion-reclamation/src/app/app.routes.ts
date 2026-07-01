import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login';
import { ReclamationView } from './features/reclamation/reclamation';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { DashboardComponent } from './features/dashboard/dashboard.component'; // Confirm your Dashboard class target file path
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Core System Wildcard Strategy & Entry Redirect Targets
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Encapsulated Structural Node Container
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reclamations', component: ReclamationView }
    ]
  },

  // Global Wildcard Route
  { path: '**', redirectTo: '/login' }
];
