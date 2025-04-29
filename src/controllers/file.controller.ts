import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import config from "@config/index";
import { fileStore } from "@utils/file-store";
import { UploadedFile } from "../types/uploaded-file.types";
import { logger } from "@utils/logger";
import { getCoolRandomName } from "@utils/get-cool-random.name";
import { htmlContent } from "@utils/home-content";

export const handleGetHome = (req: Request, res: Response) => {
  // Send the response
  res.setHeader("Content-Type", "text/html");
  res.send(htmlContent(config.linkExpiryMs));
};

export const handleUploadFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }

  try {
    let id = getCoolRandomName();
    const isNameBusy = fileStore.get(id);
    if (isNameBusy) {
      id = uuidv4();
    }
    const fileData: UploadedFile = {
      id,
      filePath: req.file.path,
      originalName: req.file.originalname,
      timestamp: Date.now(),
      mimeType: req.file.mimetype,
    };

    fileStore.add(id, fileData);
    logger.info(
      `File uploaded: ${fileData.originalName} -> ${fileData.filePath} (ID: ${id})`
    );

    const downloadUrl = `${config.downloadDomain}/file/${id}`;

    res.status(201).send(`
        <h1>Your link: ${downloadUrl}</h1>
    `);
  } catch (error) {
    logger.error("Error processing upload after file save:", error);

    // clean up the saved file if processing fails after saving
    if (req.file?.path) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr)
          logger.error(
            `Failed to cleanup partially uploaded file: ${req.file?.path}`,
            unlinkErr
          );
      });
    }
    next(error); // pass error to the global error handler
  }
};

export const handleDownloadFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const fileId = req.params.id;
  const fileData = fileStore.get(fileId);

  if (!fileData) {
    logger.warn(`Download attempt failed: ID ${fileId} not found in store.`);
    res.status(404).send("File not found or link expired.");
    return;
  }

  logger.info(
    `Serving file for download: ID ${fileId} (${fileData.originalName})`
  );

  res.download(fileData.filePath, fileData.originalName, (err) => {
    if (err) {
      // handle errors during file streaming (connection closed etc.)
      logger.error(
        `Error sending file ${fileId} (${fileData.originalName}):`,
        err
      );
      if (!res.headersSent) {
        next(err);
      }
    } else {
      logger.info(
        `File ${fileId} (${fileData.originalName}) downloaded successfully.`
      );
      // NOTE: uncomment for one-time download
      //   fileService.cleanupFile(fileId);
    }
  });
};
