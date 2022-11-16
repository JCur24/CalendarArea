import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import InteractableArea from './InteractableArea';
import {
  BoundingBox,
  TownEmitter,
  Event,
  CalendarArea as CalendarAreaModel,
} from '../types/CoveyTownSocket';
import Player from '../lib/Player';

export default class CalendarArea extends InteractableArea {
  /* The events in this CalendarArea */
  private _events: Event[];

  public get events() {
    return this._events;
  }

  /**
   * Creates a new ConversationArea
   *
   * @param events model containing this area's current topic and its ID
   * @param coordinates  the bounding box that defines this conversation area
   * @param townEmitter a broadcast emitter that can be used to emit updates to players
   */
  public constructor(
    calendarAreaModel: CalendarAreaModel,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,
  ) {
    super(calendarAreaModel.id, coordinates, townEmitter);
    this._events = calendarAreaModel.events;
  }

  /**
   * Removes a player from this conversation area.
   *
   * Extends the base behavior of InteractableArea.
   *
   * @param player
   */
  public remove(player: Player) {
    super.remove(player);
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
    };
  }

  /**
   * Creates a new ConversationArea object that will represent a Conversation Area object in the town map.
   * @param mapObject An ITiledMapObject that represents a rectangle in which this conversation area exists
   * @param broadcastEmitter An emitter that can be used by this conversation area to broadcast updates
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
    this._events = events;
  }
}
