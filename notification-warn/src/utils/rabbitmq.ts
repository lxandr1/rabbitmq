import amqplib, { Connection, Channel, ConsumeMessageFields, ConsumeMessage, Message } from "amqplib";

const HOST: string = "amqp://localhost";
const PORT: number | string = 5672 || process.env.RABBIT_PORT;
const queueList = ["notification"] as const;
let connection: Connection, channel: Channel;

async function Initialize(queue: (typeof queueList)[number]) {
  try {
    connection = await amqplib.connect(`${HOST}:${PORT}`);
    console.log(`RabbitMQ already running on ${HOST}:${PORT}`);

    channel = await connection.createChannel();
    channel.assertQueue(queue);
  } catch (error) {
    console.log(`Ops, RabbitMQ have an error`, error);
    throw new Error();
  }
}

async function ProduceMessage(queue: (typeof queueList)[number], paylaod: { ack: boolean; id: string; message: string }) {
  try {
    const result = await channel.sendToQueue(queue, Buffer.from(JSON.stringify(paylaod)));
    if (result) {
      console.log(`Successfully sent mesesage to queue id ${paylaod.id}`);
    }
  } catch (error) {
    console.log(error);
  }
}

function ConsumeMessage(queue: (typeof queueList)[number]) {
  // let them running as synchronous
  channel.consume(
    queue,
    (data: Message | null) => {
      if (data) {
        console.log("Received notfication . . . ", JSON.parse(data.content.toString()));
      }
    },
    { noAck: false }
  );
}

async function CloseConnection() {
  await Promise.all([channel.close(), connection.close()]);
}

export { Initialize, ProduceMessage, ConsumeMessage, CloseConnection };
