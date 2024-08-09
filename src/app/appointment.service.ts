import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {v4 as uuidv4} from "uuid"

interface Event {
  id: string;
  date: Date;
  eventTitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsMap: { [key: string]: Event[] } = {};
  private eventsSubject = new BehaviorSubject<{ [key: string]: Event[] }>({});

  events$: Observable<{ [key: string]: Event[] }> = this.eventsSubject.asObservable();

  constructor() { }

  addEvent(date: Date, eventTitle: string): void {
    const dateKey = this.getDateKey(date);
    const eventId = uuidv4();

    if (!this.eventsMap[dateKey]) {
      this.eventsMap[dateKey] = [];
    }
    this.eventsMap[dateKey].push({ id: eventId, date, eventTitle });
    this.eventsSubject.next(this.eventsMap);
  }

  moveEvent(previousDate: Date, newDate: Date, eventId: string): void {
    const previousDateKey = this.getDateKey(previousDate);
    const newDateKey = this.getDateKey(newDate);

    if (previousDateKey === newDateKey) return;

    const event = this.eventsMap[previousDateKey]?.find(event => event.id === eventId);
    if (event) {
      // Remove from previous date
      this.eventsMap[previousDateKey] = this.eventsMap[previousDateKey].filter(event => event.id !== eventId);
      if (this.eventsMap[previousDateKey].length === 0) {
        delete this.eventsMap[previousDateKey];
      }
      // Add to new date
      if (!this.eventsMap[newDateKey]) {
        this.eventsMap[newDateKey] = [];
      }
      this.eventsMap[newDateKey].push({ ...event, date: newDate });
    }

    this.eventsSubject.next(this.eventsMap);
  }

  deleteEvent(date: Date, eventId: string): void {
    const dateKey = this.getDateKey(date);
    if (this.eventsMap[dateKey]) {
      this.eventsMap[dateKey] = this.eventsMap[dateKey].filter(event => event.id !== eventId);
      if (this.eventsMap[dateKey].length === 0) {
        delete this.eventsMap[dateKey];
      }
      this.eventsSubject.next(this.eventsMap);
    }
  }

  private getDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
}
