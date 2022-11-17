import EventEmitter from 'events';
import _ from 'lodash';
import TypedEmitter from 'typed-emitter';
import { CalendarEvent } from '../types/CoveyTownSocket';

/**
 * The events that the CalendarAreaController emits to subscribers. These events
 * are only ever emitted to local components (not to the townService).
 */
export type CalendarAreaEvents = {
  /**
   * A playbackChange event indicates that the playing/paused state has changed.
   * Listeners are passed the new state in the parameter `isPlaying`
   */
  eventsChange: (events: CalendarEvent[]) => void;
};

/**
 * A CalendarAreaController manages the state for a CalendarArea in the frontend app, serving as a bridge between the calendar
 * that is in the browser and the backend TownService, ensuring that all players viewing the same calendar
 * are have the same events.
 *
 * The CalendarAreaController implements callbacks that handle events from the video player in this browser window, and
 * emits updates when the state is updated, @see ViewingAreaEvents
 */
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
