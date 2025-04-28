import path from "path";

const config = {
  env: "dev",
  port: 3000,
  uploadDir: path.resolve(__dirname, "..", "..", "storage"),
  maxFileSizeMB: 10,
  linkExpiryMs: 10 * 60 * 1000,
  cleanupIntervalMs: 60 * 1000,
  allowedMimeTypes: /png|jpeg|jpg|gif|webp|tiff/,
  logLevel: "info",

  get maxFileSizeBytes(): number {
    return this.maxFileSizeMB * 1024 * 1024;
  },
  get linkExpiryMinutes(): number {
    return this.linkExpiryMs / 60000;
  },
};

export default config;

import fs from "fs";
if (!fs.existsSync(config.uploadDir)) {
  console.log(`Creating upload directory: ${config.uploadDir}`);
  fs.mkdirSync(config.uploadDir, { recursive: true });
}
