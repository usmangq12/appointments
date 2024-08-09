import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EventService } from './appointment.service';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    AppointmentListComponent,
    AppointmentFormComponent,
    DragDropModule,
  ],
  providers: [EventService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'appionments';
}
