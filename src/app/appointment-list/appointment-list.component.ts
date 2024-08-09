import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { MatDialog } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { AppointmentFormComponent } from "../appointment-form/appointment-form.component";
import { EventService } from "../appointment.service";
import { MatIconModule } from "@angular/material/icon";
import { Observable, map } from "rxjs";

@Component({
  selector: "app-appointment-list",
  standalone: true,
  templateUrl: "./appointment-list.component.html",
  styleUrls: ["./appointment-list.component.scss"],
  imports: [CommonModule, DragDropModule, MatButtonModule, MatIconModule],
})
export class AppointmentListComponent implements OnInit {
  weekDays: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  monthDays: { date: number; month: number; year: number; isOutsideMonth: boolean }[] = [];
  events$: Observable<{ [date: string]: { id: string; date: Date; eventTitle: string }[] }> | undefined;

  @ViewChild("dropContainer") dropContainer: ElementRef | undefined;

  constructor(private eventService: EventService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.events$ = this.eventService.events$; 
    this.generateMonthView(new Date());
  }
  

  getEvents(date: number, month: number, year: number): Observable<{ id: string; date: Date; eventTitle: string }[]> {
    const dateKey = `${year}-${month}-${date}`;
    return (this.events$ ?? new Observable()).pipe(map(eventsMap => eventsMap[dateKey] || []));
  }

  generateMonthView(date: Date): void {
    this.monthDays = [];
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const prevMonthDays = startDay;
    const nextMonthDays = 42 - (totalDays + prevMonthDays);

    // Add previous month's days
    const prevMonth = new Date(year, month - 1);
    const prevMonthLastDay = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
    for (let i = prevMonthLastDay.getDate() - prevMonthDays + 1; i <= prevMonthLastDay.getDate(); i++) {
      this.monthDays.push({
        date: i,
        month: prevMonth.getMonth(),
        year: prevMonth.getFullYear(),
        isOutsideMonth: true,
      });
    }

    // Add the current month's days
    for (let i = 1; i <= totalDays; i++) {
      this.monthDays.push({
        date: i,
        month: month,
        year: year,
        isOutsideMonth: false,
      });
    }

    // Add next month's days
    for (let j = 1; j <= nextMonthDays; j++) {
      this.monthDays.push({
        date: j,
        month: month + 1,
        year: year,
        isOutsideMonth: true,
      });
    }
  }

  onDrop(event: CdkDragDrop<{ id: string; date: Date; eventTitle: string }[]>): void {
    const draggedItem = event.item.data as { id: string; date: Date; eventTitle: string };
    const previousDate = draggedItem.date;

    // Access the drop target container
    const dropTargetContainer = event.container.element.nativeElement;
    const newDate = this.getDateFromContainer(dropTargetContainer);
    
    if (newDate === null) {
      return;
    }
    
    const newDateObj = new Date(draggedItem.date);
    newDateObj.setDate(newDate.date);
    newDateObj.setMonth(newDate.month);
    newDateObj.setFullYear(newDate.year);

    if (previousDate.getTime() === newDateObj.getTime()) {
      return;
    }

    this.eventService.moveEvent(draggedItem.date, newDateObj, draggedItem.id);
    
    this.events$ = this.eventService.events$;
  }

  private getDateFromContainer(containerElement: HTMLElement): { date: number, month: number, year: number } | null {
    const dateAttribute = containerElement.getAttribute("data-date");
    const monthAttribute = containerElement.getAttribute("data-month");
    const yearAttribute = containerElement.getAttribute("data-year");
    return dateAttribute && monthAttribute && yearAttribute ? {
      date: parseInt(dateAttribute, 10),
      month: parseInt(monthAttribute, 10),
      year: parseInt(yearAttribute, 10)
    } : null;
  }

  deleteEvent(date: number, eventId: string): void {
    const eventDate = new Date();
    eventDate.setDate(date);
    this.eventService.deleteEvent(eventDate, eventId);
  }

  openEventDialog(date: number, month: number, year: number): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      data: { date: new Date(year, month, date) },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventService.addEvent(result.eventDate, result.eventTitle);
      }
    });
  }

  openEventDialogForToday(): void {
    const today = new Date();
    this.openEventDialog(today.getDate(), today.getMonth(), today.getFullYear());
  }
}
