import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { STATUS_CODES } from "../constants";

interface ExtendedRequest extends Request {
  userId?: number;
}

export const checkAuthorization = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Bearer <token>

  if (!token) {
    res.status(STATUS_CODES.BAD_REQUEST).send({ message: "No token provided" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (error, payload) => {
    if (error) {
      res.status(STATUS_CODES.UNAUTHORIZED).send({ message: "Unauthorized" });
      return;
    }

    req.userId = (payload as { id: number }).id;

    next();
  });
};
