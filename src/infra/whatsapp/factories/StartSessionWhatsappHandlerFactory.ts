import { WhatsappHandler } from "@core/infra/WhatsappHandler";
import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/PrismaUsersRepository";
import { PrismaSessionsRepository } from "@modules/sessions/repositories/prisma/PrismaSessionsRepository";
import { StartSessionWhatsappHandler } from "../handlers/StartSessionWhatsappControllerHandler";

export function makeStartSessionWhatsappHandler(): WhatsappHandler {
  const prismaUsersRepository = new PrismaUsersRepository();

  const startSessionWhatsappHandler = new StartSessionWhatsappHandler(
    prismaUsersRepository
  );

  return startSessionWhatsappHandler;
}
