import fs from "fs";
import path from "path";
import config from "@config/index";
import { fileStore } from "@utils/file-store";
import { logger } from "@utils/logger";

/**
 * Deletes the physical file and removes the link entry.
 */
function cleanupFile(fileId: string): void {
  const fileData = fileStore.get(fileId);
  if (fileData) {
    fs.unlink(fileData.filePath, (err) => {
      if (err) {
        logger.error(`Error deleting file ${fileData.filePath}:`, err);
      } else {
        logger.info(`Deleted expired file: ${fileData.filePath}`);
      }
    });

    fileStore.delete(fileId);
    logger.info(`Removed link entry for ID: ${fileId}`);
  }
}

/**
 * Checks for and cleans up expired files based on their timestamp.
 */
function runPeriodicCleanup(): void {
  const now = Date.now();
  logger.info("Running periodic cleanup...");
  let deletedCount = 0;
  for (const [fileId, fileData] of fileStore.getAll()) {
    if (now - fileData.timestamp > config.linkExpiryMs) {
      logger.info(
        `Periodic cleanup: Found expired link ${fileId}. Cleaning up...`
      );
      cleanupFile(fileId);
      deletedCount++;
    }
  }
  logger.info(
    `Periodic cleanup finished. Removed ${deletedCount} expired links/files.`
  );
}

// holds the interval timer
let cleanupIntervalId: NodeJS.Timeout | null = null;

/**
 * Starts the periodic cleanup process.
 */
function startPeriodicCleanup(): void {
  if (cleanupIntervalId) {
    logger.warn("Periodic cleanup is already running.");
    return;
  }
  logger.info(
    `Starting periodic cleanup. Interval: ${
      config.cleanupIntervalMs / 1000
    } seconds.`
  );

  runPeriodicCleanup();
  cleanupIntervalId = setInterval(runPeriodicCleanup, config.cleanupIntervalMs);
}

/**
 * Stops the periodic cleanup process.
 */
function stopPeriodicCleanup(): void {
  if (cleanupIntervalId) {
    clearInterval(cleanupIntervalId);
    cleanupIntervalId = null;
    logger.info("Stopped periodic cleanup.");
  } else {
    logger.warn("Periodic cleanup is not running.");
  }
}

export const fileService = {
  cleanupFile,
  startPeriodicCleanup,
  stopPeriodicCleanup,
};
