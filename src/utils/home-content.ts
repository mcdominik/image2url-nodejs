const styles = `
    :root {
      --primary-color: #007bff;
      --primary-hover-color: #0056b3;
      --text-color: #333;
      --bg-color: #f8f9fa;
      --container-bg: #ffffff;
      --border-color: #dee2e6;
      --shadow-color: rgba(0, 0, 0, 0.1);
      --border-radius: 6px;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      margin: 0;
      padding: 1rem;
      background-color: var(--bg-color);
      color: var(--text-color);
      line-height: 1.6;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
    }

    .container {
      background-color: var(--container-bg);
      padding: 2rem;
      border-radius: var(--border-radius);
      box-shadow: 0 4px 12px var(--shadow-color);
      max-width: 600px;
      width: 100%;
      text-align: center;
      margin-top: 2rem;
      margin-bottom: 2rem;
    }

    h1 {
      color: var(--primary-color);
      margin-top: 0;
      margin-bottom: 2rem;
      font-weight: 600;
    }

    form {
      margin-top: 0;
      margin-bottom: 2.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    input[type="file"] {
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 0.5rem 0.75rem;
      max-width: 100%;
      cursor: pointer;
      color: var(--text-color);
    }

    input[type="file"]::file-selector-button {
      background-color: #e9ecef;
      border: 1px solid var(--border-color);
      padding: 0.5rem 0.75rem;
      border-radius: var(--border-radius);
      margin-right: 0.75rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

     input[type="file"]::file-selector-button:hover {
       background-color: #ced4da;
     }

    button[type="submit"] {
      background-color: var(--primary-color);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: var(--border-radius);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
      min-width: 120px;
    }

    button[type="submit"]:hover {
      background-color: var(--primary-hover-color);
    }

    .info-section {
        margin-top: 0;
    }

    .info-section p {
      margin-bottom: 0.5rem;
      margin-top: 0;
      color: #555;
      font-size: 0.9rem;
    }

     .info-section p:last-child {
        margin-bottom: 0;
     }

    @media (max-width: 640px) {
      body {
        padding: 0.5rem;
        align-items: flex-start;
      }
      .container {
        padding: 1.5rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
      }
      h1 {
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
      }
       form {
         margin-bottom: 2rem;
       }
      button[type="submit"] {
         width: 100%;
         max-width: 300px;
         padding: 0.8rem 1rem;
      }
       input[type="file"] {
         font-size: 0.9rem;
       }
    }
  `;

export const htmlContent = (linkExpiryMs: number) => `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Image Sharing Service</title>
          <style>
              ${styles}
          </style>
      </head>
      <body>
          <div class="container">
              <h1>File Sharing Service</h1>
              <form action="/upload" method="post" enctype="multipart/form-data">
                  <label for="imageFile" style="display: none;">Select Image</label> <input type="file" id="imageFile" name="imageFile" accept="image/png, image/jpeg, image/gif, image/webp, image/tiff" required>
                  <button type="submit">Upload Image</button>
              </form>
              <p>Links expire after: ${linkExpiryMs / (60 * 1000)} minutes.</p>
          </div>
      </body>
      </html>
    `;
