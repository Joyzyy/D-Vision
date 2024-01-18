import { useAtom } from "jotai";
import { user_atom } from "@/lib/atoms";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { DateTimePicker } from "../DateTimePicker";
import { SERVER_URL } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import type { event } from "@/models/event";
import { Badge } from "@/components/ui/badge";
import { event_group } from "@/models/event_group";
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
import { user } from "@/models/user";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ScrollArea } from "../ui/scroll-area";

const FormSchema = z.object({
  name: z
    .string({
      required_error: "Numele este obligatoriu",
    })
    .min(2, {
      message: "Numele trebuie sa fie mai mare de 2 caractere!",
    })
    .max(50, {
      message: "Numele depaseste limita de caractere",
    }),
  start_date: z.date({
    required_error: "Data de inceput este obligatorie",
  }),
  end_date: z
    .date({
      required_error: "Data de sfarsit este obligatorie",
    })
    .refine(
      (data) => {
        return data > new Date();
      },
      {
        message: "Data de sfarsit trebuie sa fie mai mare decat data curenta",
      }
    ),
  event_group: z.string(),
});

type event_group_with_events = event_group & { events: event[] };
type ModifiedEventGroup = Omit<
  event_group_with_events,
  "events" | "start_time" | "end_time"
>;

const AddEvent: React.FC<{ shouldRefetch: any; setShouldRefetch: any }> = ({
  shouldRefetch,
  setShouldRefetch,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [eventGroups, setEventGroups] = useState<ModifiedEventGroup[]>();

  useEffect(() => {
    fetch(`${SERVER_URL}/events/groups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((payload: { data: event_group_with_events[] }) => {
        if (payload.data) {
          const modifiedEventGroups = payload.data.map((eventGroup) => {
            const { events, ...rest } = eventGroup;
            return rest;
          });
          setEventGroups(modifiedEventGroups);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      start_date: new Date(),
      end_date: new Date(),
      event_group: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (data.end_date <= data.start_date) {
      form.setError("end_date", {
        type: "manual",
        message: "Data de sfarsit trebuie sa fie dupa data de inceput",
      });
      return;
    }

    if (!data.event_group) data.event_group = "none";

    fetch(`${SERVER_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: data.name,
        start_time: data.start_date,
        end_time: data.end_date,
        event_group: data.event_group,
      }),
    })
      .then((res) => res.json())
      .then((payload: { event: event }) => {
        if (payload.event) {
          toast({
            title: "Eveniment adaugat cu succes!",
            description: `Evenimentul ${payload.event.name} a fost adaugat cu succes!`,
            type: "background",
          });
          setShouldRefetch(!shouldRefetch);
        }
      })
      .catch((error) => console.error(error));

    // make data empty
    form.reset({
      name: "",
      start_date: new Date(),
      end_date: new Date(),
      event_group: "",
    });
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={250}>
          <TooltipTrigger asChild>
            <Button
              variant={"outline"}
              onClick={() => setIsDialogOpen(!isDialogOpen)}
              size={"icon"}
            >
              <PlusIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={"bottom"}>Adauga eveniment nou</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={isDialogOpen}
        onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
      >
        <DialogContent className="max-w-sm sm:max-w-lg">
          <DialogHeader>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <Cross2Icon
                className="w-4 h-4"
                onClick={() => setIsDialogOpen(!isDialogOpen)}
              />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DialogTitle>Adauga eveniment nou</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nume eveniment</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nume eveniment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de inceput</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de sfarsit</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="event_group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grup eveniment</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Adauga la un grup de evenimente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">
                          Nu adauga la un grup de evenimente
                        </SelectItem>
                        {eventGroups &&
                          eventGroups.map((eventGroup) => (
                            <SelectItem
                              key={eventGroup.id}
                              value={`${eventGroup.name}`}
                            >
                              {eventGroup.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button type={"submit"} variant={"default"}>
                Adauga
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

type AttendanceUser = {
  name: string;
  email: string;
  attendance_time: Date;
  attendance_id: number;
};

const EventOrganizer: React.FC = () => {
  /* pagination */
  const [events, setEvents] = useState<event[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [currentUser] = useAtom(user_atom);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);
  const [attendanceUsers, setAttendanceUsers] = useState<AttendanceUser[]>([]);
  const limit = 10;

  useEffect(() => {
    fetch(`${SERVER_URL}/events?page=${currentPage}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((payload: { data: event[]; num: number }) => {
        if (payload.data) {
          setEvents(payload.data);
          const numOfPages = Math.ceil(payload.num / limit);
          setNumberOfPages(numOfPages);
        } else throw new Error("No events found");
      })
      .catch((err) => console.error(err));
  }, [currentPage, shouldRefetch]);

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

  const exportToCSV = () => {
    const csv = Papa.unparse(attendanceUsers);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "attendance.csv");
  };

  const exportToXLSX = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(attendanceUsers);
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, "attendance.xlsx");
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center items-center">
        <div className="text-4xl font-bold">Organizator evenimente</div>
        <div className="text-2xl font-bold">
          Cursuri create de {currentUser?.name}
        </div>
      </div>
      <div className="flex flex-row justify-end items-end space-y-2 pr-4">
        <AddEvent
          shouldRefetch={shouldRefetch}
          setShouldRefetch={setShouldRefetch}
        />
      </div>
      <div className="flex flex-col justify-center items-center pb-12">
        <div className="flex flex-row flex-wrap justify-center items-center mt-12">
          {events?.map((event) => (
            <Card key={event.access_code} className="w-96 m-4">
              <CardHeader>
                <CardTitle className="flex flex-row justify-between items-start">
                  <pre>{event.name}</pre>
                  <Badge
                    variant={event.state === "OPEN" ? "outline" : "destructive"}
                  >
                    {event.state}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardFooter>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button onClick={() => handleAttendance(event.id)}>
                      Detalii
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className={`w-full`}>
                      <div className="p-4 pb-0 flex flex-col items-center justify-center space-x-2 space-y-4">
                        <DrawerHeader>
                          <DrawerTitle>{event.name}</DrawerTitle>
                          <DrawerDescription>
                            <div className="flex flex-col justify-start items-start">
                              <pre>Informatii despre eveniment</pre>
                              <div className="flex flex-row justify-between items-end space-x-12">
                                <div className="text-sm font-bold">
                                  Data de inceput
                                </div>
                                <div className="text-sm">
                                  {new Date(event.start_time).toLocaleString()}
                                </div>
                              </div>
                              <div className="flex flex-row justify-between items-end space-x-12">
                                <div className="text-sm font-bold">
                                  Data de sfarsit
                                </div>
                                <div className="text-sm">
                                  {new Date(event.end_time).toLocaleString()}
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
                                <div className="text-sm font-bold">Cod QR</div>
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
                                      <TableCaption>
                                        <div className="flex flex-col justify-center items-center">
                                          <pre>
                                            Exporteaza lista cu participantii
                                          </pre>
                                          <div className="flex flex-row justify-center items-center space-x-2">
                                            <Button
                                              variant={"link"}
                                              onClick={exportToCSV}
                                            >
                                              CSV
                                            </Button>
                                            <Button
                                              variant={"link"}
                                              onClick={exportToXLSX}
                                            >
                                              XLSX
                                            </Button>
                                          </div>
                                        </div>
                                      </TableCaption>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead scope="col">
                                            Nume
                                          </TableHead>
                                          <TableHead>Email</TableHead>
                                          <TableHead>Prezent la</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {attendanceUsers?.map((user) => (
                                          <TableRow key={user.attendance_id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                              {new Date(
                                                user.attendance_time
                                              ).toLocaleTimeString()}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                      <TableFooter>
                                        <TableRow>
                                          <TableCell colSpan={3}>
                                            Total participanti
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {attendanceUsers?.length}
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
                            <Button variant={"outline"}>Ok</Button>
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
      </div>
      {numberOfPages > 1 && (
        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationPrevious
              onClick={() =>
                currentPage !== 1 && setCurrentPage(currentPage - 1)
              }
            />
            {Array.from({ length: numberOfPages }).map((_, index) => (
              <PaginationContent key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={index + 1 === currentPage}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationContent>
            ))}
            <PaginationNext
              onClick={() =>
                currentPage !== numberOfPages && setCurrentPage(currentPage + 1)
              }
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

const DashboardOverviewComponent: React.FC = () => {
  const [user] = useAtom(user_atom);
  return (
    <div className="flex flex-row flex-wrap justify-center items-center">
      {user?.role === "event_organizer" && <EventOrganizer />}
    </div>
  );
};

export default DashboardOverviewComponent;
