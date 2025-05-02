import http from "http";
import { Express } from "express";
import request from "supertest";

import app from "../../src/app";

import { fileService } from "../../src/services/file.service";
import { logger } from "../../src/utils/logger";

export interface TestApplication {
  app: Express;
  server: http.Server;
  close: () => Promise<void>;
}

interface TestAppOptions {
  uploadDir?: string;
}

export async function createTestApp(
  options: TestAppOptions = {}
): Promise<TestApplication> {
  const server = http.createServer(app);

  await new Promise<void>((resolve, reject) => {
    server.listen(0, () => {
      const address = server.address();
      if (address && typeof address !== "string") {
        const port = address.port;
        logger.info(`Test server running on port: ${port}`);
      } else {
        logger.warn("Test server started but could not determine port.");
      }
      resolve();
    });
    server.on("error", (err) => {
      logger.error("Error starting test server:", err);
      reject(err);
    });
  });

  const close = async (): Promise<void> => {
    logger.debug("Closing test server...");
    fileService.stopPeriodicCleanup();

    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          logger.error("Error closing test server:", err);
          return reject(err);
        }
        logger.debug("Test server closed successfully.");
        resolve();
      });
    });
  };

  return {
    app,
    // agent,
    server,
    close,
  };
}
