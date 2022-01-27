import { Controller } from "@core/infra/Controller";
import { PrismaSessionsRepository } from "@modules/sessions/repositories/prisma/PrismaSessionsRepository";
import { StartSessionWhatsapp } from "@modules/sessions/useCases/StartSessionWhatsapp/StartSessionWhatsapp";
import { StartSessionWhatsappController } from "@modules/sessions/useCases/StartSessionWhatsapp/StartSessionWhatsappController";

export function makeStartSessionWhatsappController(): Controller {
  const prismaSessionsRepository = new PrismaSessionsRepository();

  const startSessionWhatsapp = new StartSessionWhatsapp(
    prismaSessionsRepository
  );

  const startSessionWhatsappController = new StartSessionWhatsappController(
    startSessionWhatsapp
  );

  return startSessionWhatsappController;
}
