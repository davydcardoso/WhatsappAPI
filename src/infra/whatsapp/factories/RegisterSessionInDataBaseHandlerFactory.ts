import { WhatsappHandler } from "@core/infra/WhatsappHandler";
import { PrismaSessionsRepository } from "@modules/sessions/repositories/prisma/PrismaSessionsRepository";
import { RegisterSessionInDataBaseHandler } from "../handlers/RegisterSessionInDataBase";

export function makeRegisterSessionInDataBaseHandler(): WhatsappHandler {
  const prismaSessionsRepository = new PrismaSessionsRepository();

  const registerSessionInDataBaseHandler = new RegisterSessionInDataBaseHandler(
    prismaSessionsRepository
  );

  return registerSessionInDataBaseHandler;
}
