import { WhatsappMessageListener } from "@core/infra/WhatsappListener";
import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/PrismaUsersRepository";
import { PrismaCompanysRepository } from "@modules/companys/repositories/prisma/PrismaCompanysRepository";
import { PrismaMessagesRepository } from "@modules/whatsapp/repositories/prisma/PrismaMessagesRepository";
import { StartMessageWhatsappListener } from "../handlers/StartMessageWhatsappListener";

export function makeStartMessageWhatsappListener(): WhatsappMessageListener {
  const prismaCompanysRepository = new PrismaCompanysRepository();
  const prismaMessagesRepository = new PrismaMessagesRepository();

  const startMessageWhatsappListener = new StartMessageWhatsappListener(
    prismaCompanysRepository,
    prismaMessagesRepository
  );

  return startMessageWhatsappListener;
}
