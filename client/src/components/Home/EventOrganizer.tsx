import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  EyeClosedIcon,
  EyeOpenIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SERVER_URL } from "@/constants";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { user } from "@/models/user";
import { user_atom } from "@/lib/atoms";
import { useAtom } from "jotai";

type TUserResponseData = {
  user: Omit<user, "id" | "password">;
  token: string;
};

const eventOrganizerSchema = z.object({
  email: z
    .string()
    .min(2, { message: "Numele trebuie sa fie mai mare de 2 caractere!" })
    .max(50, { message: "Numele depaseste limita de caractere" }),
  password: z
    .string()
    .min(8, { message: "Parola trebuie sa fie mai mare de 8 caractere!" }),
});

const createEventOrganizerSchema = eventOrganizerSchema.and(
  z.object({
    name: z
      .string()
      .min(2, { message: "Numele trebuie sa fie mai mare de 2 caractere!" })
      .max(50, { message: "Numele depaseste limita de caractere" }),
  })
);

const LoginTab: FC = () => {
  const [_, setUser] = useAtom(user_atom);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof eventOrganizerSchema>>({
    resolver: zodResolver(eventOrganizerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof eventOrganizerSchema>) => {
    fetch(`${SERVER_URL}/users/login`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error("Email/parola gresita");
      })
      .then((data: TUserResponseData) => {
        if (!data.token)
          throw new Error("A aparut o eroare la serverele noastre!");
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/dashboard", { replace: true });
      })
      .catch((err: Error) => setError(err.message));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@*.ase.ro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parola</FormLabel>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="*********"
                    {...field}
                  />
                </FormControl>
                {showPassword ? (
                  <EyeOpenIcon onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <EyeClosedIcon
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {error ? (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Eroare</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          ""
        )}
        <Button type="submit" className="w-full">
          Send
        </Button>
      </form>
    </Form>
  );
};

const SignupTab: FC = () => {
  const [_, setUser] = useAtom(user_atom);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof createEventOrganizerSchema>>({
    resolver: zodResolver(createEventOrganizerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createEventOrganizerSchema>) => {
    fetch(`${SERVER_URL}/users/create`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name: values.name,
        role: "event_organizer",
        email: values.email,
        password: values.password,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error("A aparut o eroare la serverele noastre!");
      })
      .then((data: TUserResponseData) => {
        if (!data) setError("A aparut o eroare la serverele noastre!");
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/dashboard", { replace: true });
      })
      .catch((err: Error) => setError(err.message));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nume</FormLabel>
              <FormControl>
                <Input placeholder="Ionut Pla" {...field} />
              </FormControl>
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
                <Input placeholder="example@*.ase.ro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parola</FormLabel>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="*********"
                    {...field}
                  />
                </FormControl>
                {showPassword ? (
                  <EyeOpenIcon onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <EyeClosedIcon
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {error ? (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Eroare</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          ""
        )}
        <Button type="submit" className="w-full">
          Send
        </Button>
      </form>
    </Form>
  );
};

const EventOrganizerComponent: FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizator event</CardTitle>
        <CardDescription>
          Foloseste-ti contul de organizator pentru a gestiona evenimente
        </CardDescription>
        <CardContent className="space-y-2">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-2">
              <LoginTab />
            </TabsContent>
            <TabsContent value="signup" className="space-y-2">
              <SignupTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export { EventOrganizerComponent };
