import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { Event } from 'socket.io';
import CalendarEvent from '../lib/CalendarEvent';
import Player from '../lib/Player';
import { getLastEmittedEvent } from '../TestUtils';
import { TownEmitter } from '../types/CoveyTownSocket';
import CalendarArea from './CalendarArea';

describe('CalendarArea', () => {
  const testAreaBox = { x: 100, y: 100, width: 100, height: 100 };
  let testArea: CalendarArea;
  const townEmitter = mock<TownEmitter>();
  const id = nanoid();
  let events: CalendarEvent[];
  let event1: Event;
  let event2: Event;
  let event3: Event;
  let event4: Event;
  let newPlayer: Player;

  beforeEach(() => {
    mockClear(townEmitter);
    event1 = {}
    testArea = new CalendarArea({ id, events }, testAreaBox, townEmitter);
    newPlayer = new Player(nanoid(), mock<TownEmitter>());
    testArea.add(newPlayer);
  });
});
