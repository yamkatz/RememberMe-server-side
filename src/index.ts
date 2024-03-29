import configDotEnv from "./config";
import express, { json } from "express";
import { notFound } from "./middleware/not-found";
import { usersRouter } from "./routes/users";
import { connect } from "./database/connection";
import { errorHandler } from "./middleware/error-handler";
import morgan from "morgan";
import cors from "cors";
import { cardsRouter } from "./routes/cards";
import { Logger } from "./logs/logger";

configDotEnv();
connect();

const app = express();
app.use(
  cors({
    // allow my client side
    origin: "http://localhost:3000",
  })
);
app.use(express.static("public"));
// middleware chain:
app.use(json());
app.use(morgan("dev"));
app.use("/api/v1/users", usersRouter); //next(err)
app.use("/api/v1/cards", cardsRouter);
app.use(errorHandler);
app.use(notFound);
app.use((err, req, res, next) => {
  if (res.statusCode >= 400) {
    Logger.error("Request failed", res.statusCode, err);
  }
  next(err);
});

const PORT = process.env.PORT ?? 8081;

app.listen(PORT, () => {
  // callback when the app is running:
  Logger.info(`App is running: http://localhost:${PORT}`);
});
