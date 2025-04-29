import express from "express";
import fileRoutes from "@routes/file.routes";
import { fileService } from "@services/file.service";
import { logger } from "@utils/logger";
import { errorHandler } from "@middleware/error-handler.middleware";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/", fileRoutes);

app.use(errorHandler);

fileService.startPeriodicCleanup();

logger.info("Express application configured.");

export default app;
