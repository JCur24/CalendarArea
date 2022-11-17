// import { mock, mockClear } from 'jest-mock-extended';
// import { nanoid } from 'nanoid';
// import Player from '../lib/Player';
// import { TownEmitter, CalendarEvent } from '../types/CoveyTownSocket';
// import CalendarArea from './CalendarArea';

// describe('CalendarArea', () => {
//   const testAreaBox = { x: 100, y: 100, width: 100, height: 100 };
//   let testArea: CalendarArea;
//   const townEmitter = mock<TownEmitter>();
//   const id = nanoid();
//   let events: CalendarEvent[];
//   let newPlayer: Player;

//   beforeEach(() => {
//     mockClear(townEmitter);
//     // `events =
//     testArea = new CalendarArea({ id, events }, testAreaBox, townEmitter);
//     newPlayer = new Player(nanoid(), mock<TownEmitter>());
//     testArea.add(newPlayer);
//   });
// });
