import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { CalendarEvent } from '../../../../../shared/types/CoveyTownSocket';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import CalendarAreaController from '../../../classes/CalendarAreaController';
import { useCalendarAreaController, useInteractable } from '../../../classes/TownController';
import CalendarAreaInteractable from './CalendarArea';
import useTownController from '../../../hooks/useTownController';
import SelectCalendarModal from './SelectCalendarModal';

export function CalendarAreaCalendar({
  controller,
}: {
  controller: CalendarAreaController;
}): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const townController = useTownController();
  const [events, setEvents] = useState<CalendarEvent[]>(controller.events);
  const [newEvent, setNewEvent] = useState<CalendarEvent>();

  useEffect(() => {
    const setPlayBackEvents = (newEvents: CalendarEvent[]) => {
      console.log(newEvents);
      setEvents(newEvents);
    };
    controller.addListener('eventsChange', setPlayBackEvents);
    return () => {
      controller.removeListener('eventsChange', setPlayBackEvents);
    };
  }, [controller]);

  function EventModal(): JSX.Element {
    const [title, setTitle] = useState('');

    return (
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Create Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={e => setTitle(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                if (newEvent) {
                  const allEvents = [...events, { ...newEvent, title }];
                  console.log('CalendarComponent Events', allEvents);
                  setEvents(allEvents);
                  controller.events = allEvents;
                  townController.emitCalendarAreaUpdate(controller);
                }
                onClose();
              }}>
              Create Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <>
      <Container className='participant-wrapper'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView='dayGridMonth'
          selectable
          selectMirror
          dayMaxEvents
          events={events}
          select={event => {
            const { start, end } = JSON.parse(JSON.stringify(event));
            setNewEvent({ start, end, title: '', id: nanoid() });
            onOpen();
          }}
          eventContent={currentEvent => {
            if (currentEvent.view.type !== 'dayGridMonth') {
              return (
                <Box>
                  <Box>
                    <Popover closeOnBlur={false} placement='left'>
                      <PopoverTrigger>
                        <FontAwesomeIcon icon={faX} onClick={() => setDeleteOpen(!deleteOpen)} />
                      </PopoverTrigger>
                      <Portal>
                        <PopoverContent>
                          <PopoverHeader>
                            <Center>Area you sure you want to delete this event?</Center>
                          </PopoverHeader>
                          <PopoverFooter alignItems='right' justifyContent='space-between' pb={4}>
                            <ButtonGroup size='sm'>
                              <Button
                                onClick={() => {
                                  setEvents(
                                    events.filter(event => event.id !== currentEvent.event.id),
                                  );
                                }}>
                                Delete
                              </Button>
                              <PopoverCloseButton />
                            </ButtonGroup>
                          </PopoverFooter>
                        </PopoverContent>
                      </Portal>
                    </Popover>{' '}
                    <b> {currentEvent.timeText}</b>
                  </Box>
                  {currentEvent.view.type === 'timeGridDay' && (
                    <Center>
                      <b>Event: </b>
                      <i> {currentEvent.event.title}</i>
                    </Center>
                  )}
                </Box>
              );
            }
          }}
        />
      </Container>
      <EventModal />
    </>
  );
}

/**
 * The Calendar Area monitors the player's interaction with a ViewingArea on the map: displaying either
 * a popup to set the video for a viewing area, or if the video is set, a video player.
 *
 * @param props: the viewing area interactable that is being interacted with
 */
export function CalendarArea({
  calendarArea,
}: {
  calendarArea: CalendarAreaInteractable;
}): JSX.Element {
  const townController = useTownController();
  const calendarAreaController = useCalendarAreaController(calendarArea.id);
  const [selectIsOpen, setSelectIsOpen] = useState(
    calendarAreaController.calendarName === undefined,
  );
  const [calendarName, setCalendarName] = useState(calendarAreaController.calendarName);
  useEffect(() => {
    const setName = (newName: string | undefined) => {
      if (!newName) {
        townController.interactableEmitter.emit('endIteraction', calendarAreaController);
      } else {
        setCalendarName(newName);
      }
    };
    calendarAreaController.addListener('calendarNameChange', setName);
    return () => {
      calendarAreaController.removeListener('calendarNameChange', setName);
    };
  }, [calendarAreaController, townController]);

  if (!calendarName) {
    return (
      <SelectCalendarModal
        isOpen={selectIsOpen}
        close={() => setSelectIsOpen(false)}
        calendarArea={calendarArea}
      />
    );
  }
  return (
    <>
      <CalendarAreaCalendar controller={calendarAreaController} />
    </>
  );
}

/**
 * The CalendarAreaWrapper will only be rendered when the user begins interacting with the town
 */
export default function CalendarAreaWrapper(): JSX.Element {
  const calendarArea = useInteractable<CalendarAreaInteractable>('calendarArea');
  if (calendarArea) {
    return <CalendarArea calendarArea={calendarArea} />;
  }
  return <></>;
}
