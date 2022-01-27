import { WhatsappMessageListener } from "@core/infra/WhatsappListener";
import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/PrismaUsersRepository";
import { StartMessageWhatsappListener } from "../handlers/StartMessageWhatsappListener";

export function makeStartMessageWhatsappListener(): WhatsappMessageListener {
  const prismaUsersRepository = new PrismaUsersRepository();

  const startMessageWhatsappListener = new StartMessageWhatsappListener(
    prismaUsersRepository
  );

  return startMessageWhatsappListener;
}
