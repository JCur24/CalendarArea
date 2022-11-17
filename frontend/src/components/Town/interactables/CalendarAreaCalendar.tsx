import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { nanoid } from 'nanoid';
import {
  Button,
  ButtonGroup,
  Center,
  Container,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import React from 'react';

export default function CalendarAreaCalendar(): JSX.Element {
  return (
    <Container className='Full-Calendar'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        initialView='dayGridMonth'
        editable={false}
        selectable
        selectMirror
        dayMaxEvents
        initialEvents={[]}
        select={event => {
          const title = prompt('Please enter a new title for your event');
          const calendarApi = event.view.calendar;

          calendarApi.unselect();

          if (title) {
            calendarApi.addEvent({
              id: nanoid(),
              title,
              start: event.startStr,
              end: event.endStr,
              allDay: event.allDay,
            });
          }
        }}
        eventContent={event => {
          return (
            <div>
              <b>{event.timeText}</b>
              <>
                {' '}
                Event: <i> {event.event.title}</i>
              </>
              <Popover closeOnBlur={false} placement='left'>
                <>
                  <PopoverTrigger>
                    <Button></Button>
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
                              event.event.remove();
                            }}>
                            Delete
                          </Button>
                          <PopoverCloseButton />
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Portal>
                </>
              </Popover>
            </div>
          );
        }}
      />
    </Container>
  );
}
