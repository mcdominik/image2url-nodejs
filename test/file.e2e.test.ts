import request from "supertest";
import fs from "fs/promises";
import { createTestApp, TestApplication } from "./utils/bootstrap";
import path from "path";

describe("File API (E2E)", () => {
  let testApp: TestApplication;

  const TEST_STORAGE_PATH = process.env.FILE_STORAGE_PATH || "./test-uploads";

  beforeAll(async () => {
    await fs.rm(TEST_STORAGE_PATH, { recursive: true, force: true }); // Clear previous runs
    await fs.mkdir(TEST_STORAGE_PATH, { recursive: true });

    testApp = await createTestApp({ uploadDir: "./test-uploads" });
  });

  afterAll(async () => {
    await testApp?.close();
  });

  it("returns 404 for a non-existent file", async () => {
    // when
    const response = await request(testApp.server).get("/files/123");

    // then
    expect(response.status).toBe(404);
  });

  it("uploads a file, returns downloadable url", async () => {
    // given
    const filePath = path.join(__dirname, "./utils/test-image.png");
    const fileBuffer = await fs.readFile(filePath);

    // when
    const response = await request(testApp.server)
      .post("/upload")
      .attach("imageFile", fileBuffer, {
        filename: "test-given.webp",
        contentType: "image/png",
      });

    // then
    const expectedHtmlRegex = /^\s*<h1>Your link: .+<\/h1>\s*$/;
    expect(response.status).toBe(201);
    expect(response.text).toMatch(expectedHtmlRegex);
  });
});
