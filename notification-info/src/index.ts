import express, { Application, Request, Response } from "express";
import { json } from "body-parser";
import RabbitMQ from "./library/RabbitMQ";
import message from "./routes/message";
import "dotenv/config";

(async () => {
  const PORT = process.env.PORT || 1232;
  const app: Application = express();

  // Initialization libs used
  app.use(json());
  await RabbitMQ.initialize();
  // Trigger consumer
  await RabbitMQ.consumeMessage("InfoQueue", ["Info"]);

  // Register Route
  app.get("/", (_req: Request, res: Response) => {
    res.send({
      status: "200",
      message: `🚀 Uptime => ${process.uptime()}`,
    });
  });

  app.use("/api/message", message);

  app.listen(PORT, () => {
    console.log(`🚀 Application running on port ${PORT}`);
  });
})();
