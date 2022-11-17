import { nanoid } from 'nanoid';
import { CalendarEvent as CalendarEventModel } from '../types/CoveyTownSocket';

/**
 * Each CalendarEvent that belongs to a CalendarArea within CoveyTown
 */
export default class CalendarEvent {
  /** The unique identifier for this even * */
  private _id: string;

  /** The event's title */
  private _title: string;

  /** The start date of the event */
  private _start: Date;

  /** The start date of the event */
  private _end: Date;

  constructor(id: string, title: string, start: Date, end: Date) {
    this._id = id;
    this._title = title;
    this._start = start;
    this._end = end;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get start(): Date {
    return this._start;
  }

  set start(value: Date) {
    this._start = value;
  }

  get end(): Date {
    return this._end;
  }

  set end(value: Date) {
    this._end = value;
  }

  toCalendarEventModel(): CalendarEventModel {
    return {
      id: this._id,
      title: this._title,
      start: this._start,
      end: this._end,
    };
  }

  static fromModel(model: CalendarEventModel) {
    return new CalendarEvent(model.id, model.title, model.start, model.end);
  }
}
