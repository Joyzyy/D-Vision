import type { Request } from "express";

export interface ExtendedRequest extends Request {
  userId?: number;
  role?: string;
}
