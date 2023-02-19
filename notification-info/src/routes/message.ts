import { Router, Request, Response } from "express";
import { ProduceMessage, Initialize, CloseConnection } from "../utils/rabbitmq";
import { v4 as uuidv4 } from "uuid";

// Mock data
import MessageMock from "../mock/message.mock.json";

const router: Router = Router();

router.get("/test", async (_req: Request, res: Response) => {
  try {
    return res.json({
      acknowledge: true,
      status: 200,
      message: "Successfully send message",
      // data: result,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Something when wrong",
    });
  }
});

router.post("/", async (_req: Request, res: Response) => {
  try {
    await Initialize("notification");

    for (const payload of MessageMock) {
      await ProduceMessage("notification", { ...payload, id: uuidv4() });
    }

    setTimeout(async () => {
      console.log(`Successfully sent message to queue, will automatically close connection to rabbitMQ`);
      await CloseConnection();
    }, 4000);

    return res.json({
      acknowledge: true,
      status: 200,
      message: "Successfully send message",
      // data: result,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Something when wrong",
    });
  }
});

export default router;
