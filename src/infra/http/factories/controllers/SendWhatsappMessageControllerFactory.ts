import { Controller } from "@core/infra/Controller";
import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/PrismaUsersRepository";
import { PrismaCompanysRepository } from "@modules/companys/repositories/prisma/PrismaCompanysRepository";
import { SendWhatsappMessage } from "@modules/whatsapp/useCases/SendWhatsappMessage/SendWhatsappMessage";
import { SendWhatsappMessageController } from "@modules/whatsapp/useCases/SendWhatsappMessage/SendWhatsappMessageController";

export function makeSendWhatsappMessageController(): Controller {
  const prismaCompanyRepository = new PrismaCompanysRepository();

  const sendWhatsappMessage = new SendWhatsappMessage(prismaCompanyRepository);

  const sendWhatsappMessageController = new SendWhatsappMessageController(
    sendWhatsappMessage
  );

  return sendWhatsappMessageController;
}
