const config = require("./utils/config");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blog");
const middleware = require("./utils/middleware");
const express = require("express");

const app = express();

logger.info("Connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error.message);
  });

app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
