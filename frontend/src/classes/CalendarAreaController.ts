import EventEmitter, { constructor } from 'events';
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
  occupantsChange: (newOccupants: PlayerController[]) => void;
};

export default class ConversationAreaController extends (EventEmitter as new () => TypedEmitter<CalendarAreaEvents>) {
  private _occupants: PlayerController[] = [];

  private _id: string;

  private _events?: CalendarEvent[];

  /**
   * Create a new CalendarAreaController
   * @param id
   * @param events
   */
  constructor(id: string, events?: CalendarEvent[]) {
    super();
    this._id = id;
    this._events = events;
  }

  /**
   * The ID of this conversation area (read only)
   */
  get id() {
    return this._id;
  }

  /**
   * The list of occupants in this conversation area. Changing the set of occupants
   * will emit an occupantsChange event.
   */
  set occupants(newOccupants: PlayerController[]) {
    if (
      newOccupants.length !== this._occupants.length ||
      _.xor(newOccupants, this._occupants).length > 0
    ) {
      this.emit('occupantsChange', newOccupants);
      this._occupants = newOccupants;
    }
  }

  get occupants() {
    return this._occupants;
  }

  /**
   * A calendar area is empty if there are no occupants in it
   */
  isEmpty(): boolean {
    return this._occupants.length === 0;
  }
}
