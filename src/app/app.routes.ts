import { Routes } from '@angular/router';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';

export const Route: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'AppointmentListComponent',
  },
  {
    path: 'AppointmentListComponent',
    loadComponent: () =>
      import('../app/appointment-list/appointment-list.component').then(
        (mod) => mod.AppointmentListComponent
      ),
  },
];
