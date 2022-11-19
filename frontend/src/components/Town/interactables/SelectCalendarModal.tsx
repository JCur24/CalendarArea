import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useCalendarAreaController } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';
import { CalendarArea as CalendarAreaModel } from '../../../types/CoveyTownSocket';
import CalendarArea from './CalendarArea';

export default function SelectCalendarModal({
  isOpen,
  close,
  calendarArea,
}: {
  isOpen: boolean;
  close: () => void;
  calendarArea: CalendarArea;
}): JSX.Element {
  const coveyTownController = useTownController();
  const calendarAreaController = useCalendarAreaController(calendarArea.name);

  const [calendarName, setCalendarName] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, isOpen]);

  const closeModal = useCallback(() => {
    coveyTownController.unPause();
    close();
  }, [coveyTownController, close]);

  const toast = useToast();

  const createCalendarArea = useCallback(async () => {
    if (calendarName && calendarAreaController) {
      const request: CalendarAreaModel = {
        id: calendarAreaController.id,
        calendarName: calendarName,
        events: [],
      };
      try {
        await coveyTownController.createCalendarArea(request);
        toast({
          title: 'Video set!',
          status: 'success',
        });
        coveyTownController.unPause();
      } catch (err) {
        if (err instanceof Error) {
          toast({
            title: 'Unable to set Calendar Name',
            description: err.toString(),
            status: 'error',
          });
        } else {
          console.trace(err);
          toast({
            title: 'Unexpected Error',
            status: 'error',
          });
        }
      }
    }
  }, [calendarName, coveyTownController, calendarAreaController, toast]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        closeModal();
        coveyTownController.unPause();
      }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pick a video to watch in {calendarAreaController.id} </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <FormControl>
            <FormLabel htmlFor='calendarName'>Calendar Name</FormLabel>
            <Input
              id='calendarName'
              name='calendarName'
              value={calendarName}
              onChange={e => setCalendarName(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={3}
            onClick={e => {
              e.preventDefault();
              createCalendarArea();
            }}>
            Set video
          </Button>
          <Button onClick={closeModal}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
