import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Cross2Icon } from "@radix-ui/react-icons";
import { event } from "@/models/event";

const createUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Numele trebuie sa fie mai mare de 2 caractere!" })
    .max(50, { message: "Numele depaseste limita de caractere" }),
  email: z
    .string()
    .email({ message: "Email-ul nu este valid!" })
    .regex(/@stud.ase.ro$/, {
      message: "Email-ul trebuie sa se termine cu @stud.ase.ro!",
    }),
});

const CreateUserComponent: FC<{ accessCode: string }> = (props) => {
  const { toast } = useToast();
  const { accessCode } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [eventData, setEventData] = useState<event>();

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const handleClick = () => {
    fetch(`http://localhost:3000/events/${accessCode}`)
      .then((response) => response.json())
      .then((data: event) => {
        setEventData(data);
        console.log(data);
        if (!data) {
          toast({
            title: "Eroare",
            description: "Codul de access nu este valid",
            variant: "destructive",
          });
          return;
        }
        setIsOpen(!isOpen);
      })
      .catch((_) => {
        toast({
          description: "A aparut o eroare",
          variant: "destructive",
        });
      });
  };

  const handleCreateUser = () => {
    console.log(form.getValues());
    setIsOpen(!isOpen);
  };

  if (accessCode.length === 0)
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"destructive"}
              className="w-full"
              onClick={() =>
                toast({
                  title: "Eroare",
                  description: "Codul de access nu poate fi gol",
                  variant: "destructive",
                })
              }
            >
              Participa
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Codul de access nu poate fi gol</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  else
    return (
      <Dialog open={isOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className="w-full"
            onClick={() => handleClick()}
          >
            Participa
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <Cross2Icon
                className="h-4 w-4"
                onClick={() => setIsOpen(!isOpen)}
              />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DialogTitle>
              Inainte de a participa la {eventData?.name}
            </DialogTitle>
            <DialogDescription>
              Inainte de a participa avem nevoie de numele tau, precum si adresa
              instutionala
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateUser)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nume</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormDescription>Introdu numele tau</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john_doe@stud.ase.ro" {...field} />
                    </FormControl>
                    <FormDescription>
                      Introdu email-ul instituional
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Salveaza</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
};

const Home: FC = () => {
  const [accessCode, setAccessCode] = useState<string>("");

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-12">
      <div>D/Vision Logo</div>
      <Tabs defaultValue="participant" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="participant">Participant</TabsTrigger>
          <TabsTrigger value="event_organizer">Event Organizer</TabsTrigger>
        </TabsList>
        <TabsContent value="participant">
          <Card>
            <CardHeader>
              <CardTitle>Participant</CardTitle>
              <CardDescription>
                Participa la o lectie prin intermediul unui cod text <br />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Text code</TabsTrigger>
                  <TabsTrigger value="qr">QR Code</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="space-y-2">
                  <Label htmlFor={"textCode"}>Cod</Label>
                  <Input
                    id={"textCode"}
                    type={"text"}
                    placeholder={"Introduceti codul de access"}
                    onInput={(e) => setAccessCode(e.currentTarget.value)}
                  />
                  <CreateUserComponent accessCode={accessCode} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
