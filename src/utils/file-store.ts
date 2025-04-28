import { logger } from "@utils/logger";
import { UploadedFile } from "types/uploaded-file.types";

// NOTE: for production, replace this with a more persistent store
const fileLinks = new Map<string, UploadedFile>();

export const fileStore = {
  add: (id: string, data: UploadedFile): void => {
    fileLinks.set(id, data);
    logger.debug(`File link added: ${id}`);
  },

  get: (id: string): UploadedFile | undefined => {
    return fileLinks.get(id);
  },

  delete: (id: string): boolean => {
    const deleted = fileLinks.delete(id);
    if (deleted) {
      logger.debug(`File link removed: ${id}`);
    }
    return deleted;
  },

  getAll: (): IterableIterator<[string, UploadedFile]> => {
    return fileLinks.entries();
  },

  getSize: (): number => {
    return fileLinks.size;
  },
};
