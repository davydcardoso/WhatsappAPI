import { Client, ClientSession } from "whatsapp-web.js";

type StartSessionWhatsappHandlerResponse = {
  session: Client;
  sessionData: ClientSession;
  tokenAccount: string;
};

export interface WhatsappHandler<T = any> {
  perform(data?: T): Promise<StartSessionWhatsappHandlerResponse>;
}
