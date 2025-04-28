import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import config from "@config/index";
import { Request } from "express";
import { UnsupportedMediaTypeError } from "./errors/unsuported-file.error";

// multer disk storage
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, config.uploadDir);
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const uniqueSuffix = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

// multer file filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // check MIME type and extension against allowed types from config
  const isAllowedMimeType = config.allowedMimeTypes.test(file.mimetype);
  const isAllowedExtname = config.allowedMimeTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (isAllowedMimeType && isAllowedExtname) {
    cb(null, true); // accept file
  } else {
    cb(
      new UnsupportedMediaTypeError(
        `Invalid file type. Only images matching ${config.allowedMimeTypes} allowed.`
      )
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: config.maxFileSizeBytes },
  fileFilter: fileFilter,
});

export default upload;
