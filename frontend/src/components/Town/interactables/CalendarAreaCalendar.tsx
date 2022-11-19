import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
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

export default function CalendarAreaCalendar(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newEvent, setNewEvent] = useState<CalendarEvent>();

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
                  setEvents([...events, { ...newEvent, title }]);
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
      <Container className='Full-Calendar'>
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
            const parsedEvent = JSON.parse(JSON.stringify(event));
            setNewEvent({ ...parsedEvent, id: nanoid() });
            onOpen();
          }}
          eventContent={currentEvent => {
            if (currentEvent.view.type !== 'dayGridMonth') {
              return (
                <Box>
                  <Box>
                    <Popover closeOnBlur={false} placement='right'>
                      <PopoverTrigger>
                        <FontAwesomeIcon icon={faX} />
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
