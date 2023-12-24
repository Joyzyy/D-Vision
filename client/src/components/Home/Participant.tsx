import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { SERVER_URL } from "@/constants";

type TEventResponseData = {
  event?: event;
  error?: string;
};

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
    fetch(`${SERVER_URL}/events/${accessCode}`)
      .then(async (response) => {
        const data: TEventResponseData = await response.json();
        if (response.ok) return data;
        else throw new Error("A aparut o eroare la serverele noastre!");
      })
      .then((data: TEventResponseData | undefined) => {
        setEventData(data?.event);
        setIsOpen(!isOpen);
      })
      .catch((err: Error) => {
        toast({
          description: err.message,
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

const ParticipantComponent: FC = () => {
  const [accessCode, setAccessCode] = useState<string>("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participant</CardTitle>
        <CardDescription>
          Participa la o lectie prin intermediul unui cod text <br />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Label htmlFor="textCode">Cod</Label>
        <Input
          id="textCode"
          placeholder="Introdu codul"
          type="text"
          onInput={(e) => setAccessCode(e.currentTarget.value)}
        />
        <CreateUserComponent accessCode={accessCode} />
      </CardContent>
    </Card>
  );
};

export { ParticipantComponent };
