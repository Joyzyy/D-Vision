import type { Response, NextFunction } from "express";
import type { ExtendedRequest } from "../constants/types";

export const isEventOrganizerMiddleware = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.role === "event_organizer") next();
  else res.status(401).send({ message: "Unauthorized" });
};
