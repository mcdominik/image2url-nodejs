import path from "path";

require("dotenv").config();

const config = {
  downloadDomain: process.env.DOWNLOAD_DOMAIN,
  env: process.env.ENV_TYPE,
  port: process.env.PORT || 3000,
  uploadDir: path.resolve(__dirname, "..", "..", "storage"),
  maxFileSizeMB: process.env.MAX_FILE_SIZE_MB,
  linkExpiryMinutes: process.env.LINK_EXPIRY_MINUTES,
  cleanupIntervalSeconds: process.env.CLEANUP_INTERVAL_SECONDS,
  allowedMimeTypes: /png|jpeg|jpg|gif|webp|tiff/,
  logLevel: "info",

  get cleanupIntervalMs(): number {
    if (!this.cleanupIntervalSeconds) {
      throw new Error("cleanupIntervalSeconds is not set");
    }
    return parseInt(this.cleanupIntervalSeconds, 10) * 1000;
  },

  get maxFileSizeBytes(): number {
    if (!this.maxFileSizeMB) {
      throw new Error("maxFileSizeMB is not set");
    }
    return parseInt(this.maxFileSizeMB, 10) * 1024 * 1024;
  },

  get linkExpiryMs(): number {
    if (!this.linkExpiryMinutes) {
      throw new Error("linkExpiryMinutes is not set");
    }
    return parseInt(this.linkExpiryMinutes as string, 10) * 60 * 1000;
  },
};

export default config;

import fs from "fs";
if (!fs.existsSync(config.uploadDir)) {
  console.log(`Creating upload directory: ${config.uploadDir}`);
  fs.mkdirSync(config.uploadDir, { recursive: true });
}
