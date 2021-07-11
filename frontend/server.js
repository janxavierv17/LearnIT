const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    // Gives our app the ability to shortcut our api.
    const server = express();
    if (dev) {
      server.use(
        "/api",
        createProxyMiddleware({
          target: "http://localhost:5000",
          changeOrigin: true,
        })
      );
    }

    server.all("*", (request, response) => {
      return handle(request, response);
    });

    server.listen(3000, (err) => {
      if (err) {
        throw errr;
      } else {
        console.log("> Ready on http://localhost:5000");
      }
    });
  })
  .catch((error) => {
    console.log("Something went wrong with our custom server:", error);
  });

/**
 * NPM Installs
 * npm i react-image-file-resizer - To resize uploaded files in the client side.
 */
