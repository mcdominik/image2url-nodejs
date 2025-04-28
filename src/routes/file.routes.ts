import { Router } from "express";
import {
  handleUploadFile,
  handleDownloadFile,
  handleGetHome,
} from "@controllers/file.controller";
import upload from "@middleware/upload.middleware";

const router = Router();

router.get("/", handleGetHome);

router.post("/upload", upload.single("imageFile"), handleUploadFile);

router.get("/file/:id", handleDownloadFile);

export default router;
