import amqplib, { Channel, ConsumeMessage } from "amqplib";

class RabbitMQ {
  // Initial Variable
  public HOST: string = "amqp://localhost";
  public PORT: number | string = 5672 || process.env.RABBIT_PORT;
  public channel: Channel;
  public exchangeName = "notification-logs";

  async initialize() {
    try {
      const connect = await amqplib.connect(`${this.HOST}:${this.PORT}`);
      this.channel = await connect.createChannel();
      console.log("RabbitMQ already connected...");
    } catch (error) {
      console.log("Ops, have an on error when initialize connection to rabbitmq", error);
    }
  }

  async publishMessage(routingKey: string, message: string) {
    // Set exchange name
    await this.channel.assertExchange(this.exchangeName, "direct");
    const notificationDetail = {
      logType: routingKey,
      message: message,
      dateTime: new Date(),
    };

    await this.channel.publish(this.exchangeName, routingKey, Buffer.from(JSON.stringify(notificationDetail)));
    console.log(`New message ${routingKey} sent to ${this.exchangeName} `);
  }

  async consumeMessage(queueName: string, directNames: Array<string>) {
    console.log("Consumer already running...");
    await this.channel.assertExchange(this.exchangeName, "direct");
    const initQueue = await this.channel.assertQueue(queueName);
    console.log(initQueue);

    for (const directName of directNames) {
      console.log(directName);
      await this.channel.bindQueue(initQueue.queue, this.exchangeName, directName);
    }

    this.channel.consume(initQueue.queue, (message: ConsumeMessage | null) => {
      if (message) {
        const decode = JSON.parse(message.content.toString());
        console.log(decode);
        this.channel.ack(message);
      }
    });
  }
}

export default new RabbitMQ();
