import { WhatsappMessageListener } from "@core/infra/WhatsappListener";
import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/PrismaUsersRepository";
import { PrismaCompanysRepository } from "@modules/companys/repositories/prisma/PrismaCompanysRepository";
import { StartMessageWhatsappListener } from "../handlers/StartMessageWhatsappListener";

export function makeStartMessageWhatsappListener(): WhatsappMessageListener {
  const prismaCompanysRepository = new PrismaCompanysRepository();

  const startMessageWhatsappListener = new StartMessageWhatsappListener(
    prismaCompanysRepository
  );

  return startMessageWhatsappListener;
}
