import { WhatsappHandler } from "@core/infra/WhatsappHandler";
import { PrismaSessionsRepository } from "@modules/sessions/repositories/prisma/PrismaSessionsRepository";
import { StartSessionWhatsappHandler } from "../handlers/StartSessionWhatsappControllerHandler";

export function makeStartSessionWhatsappHandler(): WhatsappHandler {
  const startSessionWhatsappHandler = new StartSessionWhatsappHandler();

  return startSessionWhatsappHandler;
}
