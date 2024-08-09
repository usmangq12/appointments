import {ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentFormComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AppointmentFormComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date }
  ) {
    this.form = this.fb.group({
      eventTitle: ["", Validators.required],
      eventDate: [this.data.date || new Date(), Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
