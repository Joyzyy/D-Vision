import type { Application } from "express";
import { EventController } from "./controllers/event";
import { UserController } from "./controllers/user";
import { PrismaClient } from "@prisma/client";

const setup = async (app: Application) => {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const eventController = new EventController(prisma);
  const userController = new UserController(prisma);

  app.use("/events", eventController.router);
  app.use("/users", userController.router);

  // for testing purposes
  app.get("/ping", (_, res) => res.status(200));
};

export { setup };
