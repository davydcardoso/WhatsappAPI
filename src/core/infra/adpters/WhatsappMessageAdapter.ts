import { Client, Message, MessageAck } from "whatsapp-web.js";
import { WhatsappMessageListener } from "../WhatsappListener";

export const adapterMessageListener = (listener: WhatsappMessageListener) => {
  return async (
    token: string,
    message: Message | MessageAck,
    whatsapp: Client
  ) => {
    return listener.perform(token, message, whatsapp);
  };
};
