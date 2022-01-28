import { WhatsappHandler } from "@core/infra/WhatsappHandler";
import { redisConnection } from "@infra/redis/connection";
import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/PrismaUsersRepository";
import { PrismaCompanysRepository } from "@modules/companys/repositories/prisma/PrismaCompanysRepository";
import { PrismaSessionsRepository } from "@modules/sessions/repositories/prisma/PrismaSessionsRepository";
import { StartSessionWhatsappHandler } from "../handlers/StartSessionWhatsappControllerHandler";

export function makeStartSessionWhatsappHandler(): WhatsappHandler {
  const prismaCompanysRepositorys = new PrismaCompanysRepository();

  const startSessionWhatsappHandler = new StartSessionWhatsappHandler(
    redisConnection,
    prismaCompanysRepositorys
  );

  return startSessionWhatsappHandler;
}
