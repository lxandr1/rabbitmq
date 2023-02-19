import { Document, model, Schema } from "mongoose";

export type TMessage = {
  message: string;
  date?: Date;
};

export interface IMessage extends TMessage, Document {}

const messageSchema: Schema = new Schema({
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Message = model<IMessage>("Message", messageSchema);

export default Message;
