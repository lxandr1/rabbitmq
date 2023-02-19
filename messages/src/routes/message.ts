import { Router, Request, Response } from "express";
import RabbitMQ from "../library/RabbitMQ";

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

router.post("/", async (req: Request<never, never, { logType: string; message: string }>, res: Response) => {
  try {
    const { logType, message } = req.body;
    await RabbitMQ.publishMessage(logType, message);

    res.send({
      acknowledge: true,
      status: 200,
      message: "Successfully send message",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Something when wrong",
    });
  }
});

export default router;
