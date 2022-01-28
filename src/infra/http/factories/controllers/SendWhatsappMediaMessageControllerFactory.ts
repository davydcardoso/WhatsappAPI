import { Controller } from "@core/infra/Controller";
import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/PrismaUsersRepository";
import { PrismaCompanysRepository } from "@modules/companys/repositories/prisma/PrismaCompanysRepository";
import { SendWhatsappMediaMessage } from "@modules/whatsapp/useCases/SendWhatsappMediaMessage/SendWhatsappMediaMessage";
import { SendWhatsappMediaMessageController } from "@modules/whatsapp/useCases/SendWhatsappMediaMessage/SendWhatsappMediaMessageController";

export function makeSendWhatsappMediaMessageController(): Controller {
  const prismaCompanysRepository = new PrismaCompanysRepository();

  const sendWhatsappMediaMessage = new SendWhatsappMediaMessage(
    prismaCompanysRepository
  );

  const sendWhatsappMediaMessageController =
    new SendWhatsappMediaMessageController(sendWhatsappMediaMessage);

  return sendWhatsappMediaMessageController;
}
