import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RecordAudioComponent } from './components/record-audio/record-audio';
import { InvoiceComponent } from './components/invoice/invoice.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'record', component: RecordAudioComponent },
  { path: 'invoice/:id', component: InvoiceComponent} ,
  { path: '**', redirectTo: '/login' }
];
