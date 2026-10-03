# Malik website

This imported project is a static HTML, CSS, and JavaScript website. Keep its
existing page and asset structure; no frontend framework or build step is needed.

## Running on Replit

Click Run to start the **Start application** workflow, which runs:

```sh
node server.js
```

The server listens on `0.0.0.0:5000` and serves `index.html`, the other root HTML
pages, and `assets/`. It does not expose project configuration or hidden files.
Node.js 20 is provided by the project's Replit configuration. No package
installation or secrets are required to serve the site.

## Existing limitations

- Fonts and many residence images depend on external services and require
  network access. During setup, the homepage hero image endpoint returned HTTP
  404, so that image was missing in the preview.
- The imported site has no backend. Booking and newsletter interactions should
  not be treated as real reservations or subscriptions until connected to
  appropriate services.