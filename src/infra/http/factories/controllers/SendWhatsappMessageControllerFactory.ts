import { Controller } from "@core/infra/Controller";
import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/PrismaUsersRepository";
import { SendWhatsappMessage } from "@modules/whatsapp/useCases/SendWhatsappMessage/SendWhatsappMessage";
import { SendWhatsappMessageController } from "@modules/whatsapp/useCases/SendWhatsappMessage/SendWhatsappMessageController";

export function makeSendWhatsappMessageController(): Controller {
  const prismaUsersRepository = new PrismaUsersRepository();

  const sendWhatsappMessage = new SendWhatsappMessage(prismaUsersRepository);

  const sendWhatsappMessageController = new SendWhatsappMessageController(
    sendWhatsappMessage
  );

  return sendWhatsappMessageController;
}
