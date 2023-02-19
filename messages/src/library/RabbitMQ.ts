import amqplib, { Channel } from "amqplib";

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
    console.log(notificationDetail);

    await this.channel.publish(this.exchangeName, routingKey, Buffer.from(JSON.stringify(notificationDetail)));
    console.log(`New message ${routingKey} sent to ${this.exchangeName} `);
  }
}

export default new RabbitMQ();
