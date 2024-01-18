import { useState, useEffect } from "react";
import type { event_group } from "@/models/event_group";
import type { event } from "@/models/event";
import { SERVER_URL } from "@/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

type ModifiedEventGroup = event_group & {
  events: event[];
};

const AddEventGroup: React.FC<{
  shouldRefetch: boolean;
  setShouldRefetch: (value: boolean) => void;
}> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const handleSubmit = () => {
    fetch(`${SERVER_URL}/events/group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name,
      }),
    })
      .then((res) => res.json())
      .then((payload: any) => {
        console.log(payload);
        setIsOpen(!isOpen);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <PopoverTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <PlusIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mx-auto mr-8">
          <div className="flex flex-col justify-center items-center">
            <div className="text-2xl font-bold">Adauga grup de evenimente</div>
            <div className="text-sm font-bold">
              Completeaza campurile de mai jos pentru a adauga un nou grup de
              evenimente
            </div>

            <div className="flex flex-row justify-center items-center space-x-4 mt-4">
              <Label htmlFor="name">Nume</Label>
              <Input
                id="name"
                placeholder="Nume"
                className="w-full"
                onInput={(e) => setName(e.currentTarget.value)}
              />
            </div>

            <Button variant={"outline"} className="mt-4" onClick={handleSubmit}>
              Adauga
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

type AttendanceUser = {
  name: string;
  email: string;
  attendance_time: Date;
  attendance_id: number;
};

const EventGroups: React.FC = () => {
  const [eventGroups, setEventGroups] = useState<ModifiedEventGroup[]>();
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);
  const [attendanceUsers, setAttendanceUsers] = useState<AttendanceUser[]>([]);

  useEffect(() => {
    fetch(`${SERVER_URL}/events/groups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((payload: { data: ModifiedEventGroup[] }) => {
        setEventGroups(payload.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAttendance = (id: number) => {
    fetch(`${SERVER_URL}/events/attendance/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((payload) => {
        if (payload.users) {
          setAttendanceUsers(payload.users);
        }
      })
      .catch((error) => console.error(error));
  };

  const fetchParticipants = async (events: event[]) => {
    return await Promise.all(
      events.map((event) =>
        fetch(`${SERVER_URL}/events/attendance/${event.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((payload) => payload.users)
          .catch((err) => console.error(err))
      )
    ).then((payload) => payload.flat());
  };

  const exportToCSV = async (events: event[]) => {
    let participants = await fetchParticipants(events);
    const csv = Papa.unparse(participants);
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(csvData, "participants.csv");
  };

  const exportToXLSX = async (events: event[]) => {
    let participants = await fetchParticipants(events);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(participants);
    XLSX.utils.book_append_sheet(wb, ws, "Participants");
    XLSX.writeFile(wb, "participants.xlsx");
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col justify-center items-center">
          <div className="text-4xl font-bold">Organizator evenimente</div>
          <div className="text-2xl font-bold">
            Grupuri de evenimente disponibile
          </div>
        </div>
        <div className="flex flex-row justify-end items-end space-y-2 pr-4">
          <AddEventGroup
            shouldRefetch={shouldRefetch}
            setShouldRefetch={setShouldRefetch}
          />
        </div>
        <div className="flex flex-col justify-center items-center pb-12">
          <div className="flex flex-row flex-wrap justify-center items-center mt-12">
            {eventGroups?.map(
              (eventGroup) =>
                eventGroup.events.length > 0 && (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-[60vw]"
                    key={eventGroup.id}
                  >
                    <AccordionItem value={eventGroup.name}>
                      <AccordionTrigger>{eventGroup.name}</AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-row justify-end items-end">
                          <div className="flex flex-col justify-center items-center">
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button
                                  variant={"link"}
                                  onClick={(e) => e.preventDefault()}
                                >
                                  Exporteaza toti participantii
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent>
                                <pre>Alege modul de exportare</pre>
                                <div className="flex flex-row justify-center items-center space-x-2 mt-2">
                                  <Button
                                    variant={"outline"}
                                    onClick={() =>
                                      exportToCSV(eventGroup.events)
                                    }
                                  >
                                    CSV
                                  </Button>
                                  <Button
                                    variant={"outline"}
                                    onClick={() =>
                                      exportToXLSX(eventGroup.events)
                                    }
                                  >
                                    XLSX
                                  </Button>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </div>
                        </div>
                        <div className="flex flex-row flex-wrap justify-center items-center mt-8">
                          {eventGroup.events.map((event) => (
                            <Card key={event.access_code} className="w-96 m-4">
                              <CardHeader>
                                <CardTitle className="flex flex-row justify-between items-start">
                                  <pre>{event.name}</pre>
                                  <Badge
                                    variant={
                                      event.state === "OPEN"
                                        ? "outline"
                                        : "destructive"
                                    }
                                  >
                                    {event.state}
                                  </Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardFooter>
                                <Drawer>
                                  <DrawerTrigger asChild>
                                    <Button
                                      onClick={() => handleAttendance(event.id)}
                                    >
                                      Detalii
                                    </Button>
                                  </DrawerTrigger>
                                  <DrawerContent>
                                    <div className={`w-full`}>
                                      <div className="p-4 pb-0 flex flex-col items-center justify-center space-x-2 space-y-4">
                                        <DrawerHeader>
                                          <DrawerTitle>
                                            {event.name}
                                          </DrawerTitle>
                                          <DrawerDescription>
                                            <div className="flex flex-col justify-start items-start">
                                              <pre>
                                                Informatii despre eveniment
                                              </pre>
                                              <div className="flex flex-row justify-between items-end space-x-12">
                                                <div className="text-sm font-bold">
                                                  Data de inceput
                                                </div>
                                                <div className="text-sm">
                                                  {new Date(
                                                    event.start_time
                                                  ).toLocaleString()}
                                                </div>
                                              </div>
                                              <div className="flex flex-row justify-between items-end space-x-12">
                                                <div className="text-sm font-bold">
                                                  Data de sfarsit
                                                </div>
                                                <div className="text-sm">
                                                  {new Date(
                                                    event.end_time
                                                  ).toLocaleString()}
                                                </div>
                                              </div>
                                              <div className="flex flex-row justify-between items-end space-x-12">
                                                <div className="text-sm font-bold">
                                                  Cod de acces
                                                </div>
                                                <div className="text-sm">
                                                  {event.access_code}
                                                </div>
                                              </div>
                                              <div className="flex flex-col justify-center items-center ml-16 space-y-2">
                                                <div className="text-sm font-bold">
                                                  Cod QR
                                                </div>
                                                <img
                                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:5173?${event.access_code}`}
                                                  alt="qr code"
                                                />
                                              </div>
                                              {attendanceUsers.length > 0 && (
                                                <div className="flex flex-col justify-center items-center w-full mt-2 space-y-2">
                                                  <div className="text-sm font-bold">
                                                    Tabel cu participanti
                                                  </div>
                                                  <ScrollArea className="h-72 rounded-md border">
                                                    <Table>
                                                      <TableHeader>
                                                        <TableRow>
                                                          <TableHead scope="col">
                                                            Nume
                                                          </TableHead>
                                                          <TableHead>
                                                            Email
                                                          </TableHead>
                                                          <TableHead>
                                                            Prezent la
                                                          </TableHead>
                                                        </TableRow>
                                                      </TableHeader>
                                                      <TableBody>
                                                        {attendanceUsers?.map(
                                                          (user) => (
                                                            <TableRow
                                                              key={
                                                                user.attendance_id
                                                              }
                                                            >
                                                              <TableCell>
                                                                {user.name}
                                                              </TableCell>
                                                              <TableCell>
                                                                {user.email}
                                                              </TableCell>
                                                              <TableCell>
                                                                {new Date(
                                                                  user.attendance_time
                                                                ).toLocaleTimeString()}
                                                              </TableCell>
                                                            </TableRow>
                                                          )
                                                        )}
                                                      </TableBody>
                                                      <TableFooter>
                                                        <TableRow>
                                                          <TableCell
                                                            colSpan={3}
                                                          >
                                                            Total participanti
                                                          </TableCell>
                                                          <TableCell className="text-right">
                                                            {
                                                              attendanceUsers?.length
                                                            }
                                                          </TableCell>
                                                        </TableRow>
                                                      </TableFooter>
                                                    </Table>
                                                  </ScrollArea>
                                                </div>
                                              )}
                                            </div>
                                          </DrawerDescription>
                                        </DrawerHeader>
                                        <DrawerFooter>
                                          <DrawerClose asChild>
                                            <Button variant={"outline"}>
                                              Ok
                                            </Button>
                                          </DrawerClose>
                                        </DrawerFooter>
                                      </div>
                                    </div>
                                  </DrawerContent>
                                </Drawer>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const EventsComponent: React.FC = () => {
  return (
    <div className="flex flex-row flex-wrap justify-center items-center">
      {<EventGroups />}
    </div>
  );
};

export default EventsComponent;
