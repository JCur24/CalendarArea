import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import InteractableArea from './InteractableArea';
import {
  BoundingBox,
  TownEmitter,
  CalendarArea as CalendarAreaModel,
} from '../types/CoveyTownSocket';
import CalendarEvent from '../lib/CalendarEvent';
import Player from '../lib/Player';

export default class CalendarArea extends InteractableArea {
  /* The Calendar name in this CalendarAea */
  private _calendarName?: string;

  /* The events in this CalendarArea */
  private _events: CalendarEvent[];

  public get events() {
    return this._events;
  }

  /**
   * Creates a new CalendarArea
   *
   * @param event model containing this area's events
   * @param coordinates  the bounding box that defines this calendar area
   * @param townEmitter a broadcast emitter that can be used to emit updates to players
   */
  public constructor(
    calendarAreaModel: CalendarAreaModel,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,
  ) {
    super(calendarAreaModel.id, coordinates, townEmitter);
    this._events = calendarAreaModel.events.map(model => CalendarEvent.fromModel(model));
  }

  /**
   * Removes a player from this calendar area.
   *
   * Extends the base behavior of InteractableArea.
   *
   * @param player
   */
  public remove(player: Player) {
    super.remove(player);
    if (this._occupants.length === 0) {
      this._emitAreaChanged();
    }
    // TODO: Possibly add more functionality to remove
  }

  /**
   * Convert this CalendarArea instance to a simple CalendarAreaModel suitable for
   * transporting over a socket to a client.
   */
  public toModel(): CalendarAreaModel {
    return {
      id: this.id,
      events: this._events,
      calendarName: this._calendarName,
    };
  }

  /**
   * Creates a new calendarArea object that will represent a calendar Area object in the town map.
   * @param mapObject An ITiledMapObject that represents a rectangle in which this calendar area exists
   * @param broadcastEmitter An emitter that can be used by this calendar area to broadcast updates
   * @returns
   */
  public static fromMapObject(
    mapObject: ITiledMapObject,
    broadcastEmitter: TownEmitter,
  ): CalendarArea {
    const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed viewing area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new CalendarArea({ id: name, events: [] }, rect, broadcastEmitter);
  }

  public updateModel({ events }: CalendarAreaModel) {
    this._events = events.map(event => CalendarEvent.fromModel(event));
  }
}
