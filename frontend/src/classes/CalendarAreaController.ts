import EventEmitter from 'events';
import _, { get } from 'lodash';
import { useEffect, useState } from 'react';
import TypedEmitter from 'typed-emitter';
import { CalendarArea as CalendarAreaModel, CalendarEvent } from '../types/CoveyTownSocket';
import PlayerController from './PlayerController';

/**
 * The events that the CalendarAreaController emits to subscribers. These events
 * are only ever emitted to local components (not to the townService).
 */
export type CalendarAreaEvents = {
  eventsChange: (events: CalendarEvent[]) => void;
};

export default class ConversationAreaController extends (EventEmitter as new () => TypedEmitter<CalendarAreaEvents>) {
  private _id: string;

  private _events: CalendarEvent[];

  /**
   * Create a new CalendarAreaController
   * @param id
   * @param events
   */
  constructor(id: string, events: CalendarEvent[]) {
    super();
    this._id = id;
    this._events = events;
  }

  /**
   * The ID of this calendar area (read only)
   */
  get id() {
    return this._id;
  }

  get events() {
    return this._events;
  }

  set events(events: CalendarEvent[]) {
    if (events.length !== this._events.length || _.xor(events, this._events).length > 0) {
      this.emit('eventsChange', events);
      this._events = events;
    }
  }
}
