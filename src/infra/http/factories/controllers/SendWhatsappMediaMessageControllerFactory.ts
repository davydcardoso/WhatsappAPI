import { Controller } from "@core/infra/Controller";
import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/PrismaUsersRepository";
import { SendWhatsappMediaMessage } from "@modules/whatsapp/useCases/SendWhatsappMediaMessage/SendWhatsappMediaMessage";
import { SendWhatsappMediaMessageController } from "@modules/whatsapp/useCases/SendWhatsappMediaMessage/SendWhatsappMediaMessageController";

export function makeSendWhatsappMediaMessageController(): Controller {
  const prismaUsersRepository = new PrismaUsersRepository();

  const sendWhatsappMediaMessage = new SendWhatsappMediaMessage(
    prismaUsersRepository
  );

  const sendWhatsappMediaMessageController =
    new SendWhatsappMediaMessageController(sendWhatsappMediaMessage);

  return sendWhatsappMediaMessageController;
}
