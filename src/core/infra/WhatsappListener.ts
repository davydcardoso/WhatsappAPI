import { Client, Message, MessageAck } from "whatsapp-web.js";

export interface WhatsappMessageListener<T = any> {
  perform(
    token: string,
    message: Message | MessageAck,
    whatsapp: Client
  ): Promise<void>;
}
