import { Request, Response, NextFunction } from "express";
import { logger } from "@utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("", err);

  // default fallback error response
  res.status(500).json({ error: "Internal Server Error" });
  return;
};
