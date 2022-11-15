import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import Player from '../lib/Player';
import { getLastEmittedEvent } from '../TestUtils';
import { TownEmitter } from '../types/CoveyTownSocket';
import CalendarArea from './CalendarArea';

describe('CalendarArea', () => {
  const testAreaBox = { x: 100, y: 100, width: 100, height: 100 };
  let testArea: ConversationArea;
  const townEmitter = mock<TownEmitter>();
  const topic = nanoid();
  const id = nanoid();
  let newPlayer: Player;

  beforeEach(() => {
    mockClear(townEmitter);
    // testArea = new ConversationArea({ topic, id, occupantsByID: [] }, testAreaBox, townEmitter);
    // newPlayer = new Player(nanoid(), mock<TownEmitter>());
    // testArea.add(newPlayer);
  });
});
