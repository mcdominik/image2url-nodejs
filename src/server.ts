import config from "@config/index";
import app from "./app";
import { logger } from "@utils/logger";
import { fileService } from "@services/file.service";

const server = app.listen(config.port, () => {
  logger.info(`Server running on http://localhost:${config.port}`);
  logger.info(`Environment: ${config.env}`);
  logger.info(`Storage (uploads) directory: ${config.uploadDir}`);
  logger.info(`Maximum file size: ${config.maxFileSizeMB} MB`);
  logger.info(`Link expiry time: ${config.linkExpiryMinutes} minutes`);
  logger.info(
    `Cleanup check interval: ${config.cleanupIntervalMs / 1000} seconds`
  );
});

// graceful shutdown handling
const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

signals.forEach((signal) => {
  process.on(signal, () => {
    logger.warn(`Received ${signal}. Shutting down gracefully...`);
    fileService.stopPeriodicCleanup(); // stop background tasks

    server.close((err) => {
      if (err) {
        logger.error("Error during server shutdown:", err);
        process.exit(1); // exit with error code
      } else {
        logger.info("Server closed successfully.");
        process.exit(0); // exit cleanly
      }
    });

    // force shutdown if server doesn't close within a timeout (10s)
    setTimeout(() => {
      logger.error("Could not close connections in time, forcing shutdown.");
      process.exit(1);
    }, 10000);
  });
});

process.on("unhandledRejection", (reason: any, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});
