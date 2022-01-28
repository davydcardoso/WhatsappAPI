import "@config/bootstrap";

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";

import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";
import uploadConfig from "@config/upload";
import { logger } from "@util/logger";
import { AppError } from "./errors/AppError";
import { routes } from "./routes";

Sentry.init({ dsn: process.env.SENTRY_DSN });

const app = express();

app.use(cors({ origin: "*" }));

app.use(morgan("dev"));

app.use(cookieParser());

app.use(
  express.json({
    type: ["application/json", "text/plain"],
    limit: "10mb"
  })
);

app.use(Sentry.Handlers.requestHandler());
app.use("/public", express.static(uploadConfig.directory));
app.use(
  "/hiperion/v1/test",
  (request: Request, response: Response, next: NextFunction) => {
    response.send({
      message: "Hiperion whatsapp API working normally",
      developer: "Davyd Kewen",
      contact:"55 62 9173-0714",
      github: "https://github.com/Rocket-Zapi",
      version: "1.0.0.0"
    });
  }
);
app.use("/hiperion/v1", routes);

app.use(Sentry.Handlers.errorHandler());

app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(err);
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

export { app };
