import type { Request, Response } from "express";
import type { PrismaClient, event, event_state } from "@prisma/client";
import { Router } from "express";
import { STATUS_CODES } from "../constants";

export { EventController };

class EventController {
  public router: Router;

  constructor(private readonly prisma: PrismaClient) {
    this.router = Router();
    this.initializeRouter();
  }

  /**
   * Initializes the router for the EventController.
   *
   * @returns {void}
   */
  initializeRouter = (): void => {
    this.router.get("/", this.getEvents);
    this.router.get("/:accessCode", this.getEvent);
    this.router.post("/", this.createEvent);
  };

  /**
   * Retrieves all events from the database and sends them as a JSON response.
   *
   * @async
   * @function
   * @param {Request} _ - The request object (unused).
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A Promise that resolves when the response has been sent.
   * @throws {Error} If there is an error retrieving the events from the database.
   */
  getEvents = async (_: Request, res: Response): Promise<void> => {
    try {
      const events = await this.prisma.event.findMany();
      res.status(STATUS_CODES.SUCCESS).json({
        data: events,
      });
    } catch (error: Error | any) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
  };

  /**
   * Retrieves a single event from the database by its ID and sends it as a JSON response.
   *
   * @async
   * @function
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A Promise that resolves when the response has been sent.
   * @throws {Error} If there is an error retrieving the event from the database.
   */
  getEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { accessCode } = req.params;
      const event = await this.prisma.event.findFirst({
        where: {
          access_code: accessCode,
        },
      });
      if (!event)
        res.status(STATUS_CODES.NOT_FOUND).json({ error: "Event not found." });
      res.status(STATUS_CODES.SUCCESS).json(event);
    } catch (error: Error | any) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
  };

  /**
   * Creates a new event in the database and sends the created event as a JSON response.
   *
   * @async
   * @function
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A Promise that resolves when the response has been sent.
   * @throws {Error} If there is an error creating the event in the database.
   */
  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: Omit<event, "start_time" | "end_time"> & {
        start_time: string;
        end_time: string;
      } = req.body;
      const newEvent = await this.prisma.event.create({
        data: {
          ...data,
          start_time: new Date(data.start_time),
          end_time: new Date(data.end_time),
        },
      });
      res.status(STATUS_CODES.CREATED).json({
        data: newEvent,
      });
    } catch (error: Error | any) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
  };
}
