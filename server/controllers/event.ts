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
    this.router.get("/groups", this.getEventGroups);
    this.router.get("/attendance/:event_id", this.getAttendanceForEvent);
    this.router.post("/", this.createEvent);
    this.router.post("/group", this.createEventGroup);
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
  getEvents = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    try {
      const events = await this.prisma.event.findMany({
        skip: skip,
        take: limit,
      });
      const totalEvents = await this.prisma.event.count();
      res.status(STATUS_CODES.SUCCESS).json({
        data: events,
        num: totalEvents,
      });
    } catch (error: any) {
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
      console.log(accessCode);
      const event = await this.prisma.event.findFirst({
        where: {
          access_code: accessCode,
        },
      });
      if (!event)
        res.status(STATUS_CODES.NOT_FOUND).json({ error: "Event not found." });
      res.status(STATUS_CODES.SUCCESS).json(event);
    } catch (error: any) {
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
  createEvent = async (
    req: Request & { userId?: number; role?: string },
    res: Response
  ): Promise<void> => {
    try {
      const data: event & {
        event_group?: string;
      } = req.body;
      const accessCode = Math.random().toString(36).substring(2, 10);
      data.access_code = accessCode;
      data.access_code_type = "both";

      console.log("comparing: ", new Date(data.start_time), new Date());
      if (new Date(data.start_time) > new Date()) data.state = "CLOSED";
      else data.state = "OPEN";

      let newEvent: event | null = null;
      if (
        data.event_group &&
        data.event_group.length > 0 &&
        data.event_group !== "none"
      ) {
        // create event group event
        const event_group = await this.prisma.event_group.findFirst({
          where: {
            name: data.event_group,
          },
        });

        if (event_group) {
          delete data.event_group;
          newEvent = await this.prisma.event.create({
            data,
          });
          console.log("the new event: ", newEvent);
          if (newEvent) {
            await this.prisma.event_group_event
              .create({
                data: {
                  event_group_id: event_group.id,
                  event_id: newEvent.id,
                },
              })
              .then((res) => console.log("event group event created: ", res))
              .catch((err) => console.error("err: ", err));
          }
        }
      } else delete data.event_group;
      if (!newEvent) {
        console.log("Creating new event!");
        newEvent = await this.prisma.event.create({
          data,
        });
        if (!newEvent)
          throw new Error("There was an error creating the event.");
      }
      console.log("new event: ", newEvent);
      res.status(STATUS_CODES.CREATED).json({
        event: newEvent,
      });
    } catch (error: any) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
  };

  getEventGroups = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    try {
      const event_groups = await this.prisma.event_group.findMany({
        skip: skip,
        take: limit,
      });
      const totalEventGroups = await this.prisma.event_group.count();
      const event_groups_with_events = await Promise.all(
        event_groups.map(async (event_group) => {
          const events = await this.prisma.event_group_event.findMany({
            where: {
              event_group_id: event_group.id,
            },
            include: {
              event: true,
            },
          });
          return {
            ...event_group,
            events: events.map((event) => event.event),
          };
        })
      );
      res.status(STATUS_CODES.SUCCESS).json({
        data: event_groups_with_events,
        num: totalEventGroups,
      });
    } catch (error: any) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
  };

  createEventGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: any = req.body;

      const newEventGroup = await this.prisma.event_group.create({
        data: {
          name: data.name,
          state: "OPEN",
          start_time: new Date(),
          end_time: new Date(),
        },
      });

      if (!newEventGroup)
        throw new Error("There was an error creating the event group.");

      res.status(STATUS_CODES.CREATED).json({
        event_group: newEventGroup,
      });
    } catch (error: any) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
  };

  getAttendanceForEvent = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { event_id } = req.params;
      const event = await this.prisma.event.findFirst({
        where: {
          id: Number(event_id),
        },
      });
      if (!event) throw new Error("There was an error retrieving the event.");

      const attendance = await this.prisma.attendance.findMany({
        where: {
          event_id: Number(event_id),
        },
      });
      if (!attendance)
        throw new Error("There was an error retrieving the attendance.");

      // get users from attendance
      const users = await Promise.all(
        attendance.map(async (attend) => {
          const user = await this.prisma.user.findFirst({
            where: {
              id: attend.participant_id,
            },
          });
          // add attendance_time to user
          const returnUser = {
            name: user?.name,
            email: user?.email,
            attendance_time: attend.attendence_time,
            attendance_id: attend.id,
          };
          return returnUser;
        })
      );
      if (!users) throw new Error("There was an error retrieving the users.");

      console.log(users);
      res.status(STATUS_CODES.SUCCESS).json({
        users,
      });
    } catch (error: any) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }
  };
}
