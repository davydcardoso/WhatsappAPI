import { WhatsappHandler } from "../WhatsappHandler";

export const adapterWhatsapp = (handler: WhatsappHandler) => {
  return async (accountId: string) => {
    return handler.perform(accountId);
  };
};
