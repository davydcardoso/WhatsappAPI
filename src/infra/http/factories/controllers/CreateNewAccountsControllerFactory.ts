import { Controller } from "@core/infra/Controller";
import { BullProvider } from "@infra/providers/implementations/queue/BullProvider";
import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/PrismaUsersRepository";
import { CreateNewAccounts } from "@modules/accounts/useCases/CreateNewAccounts/CreateNewAccounts";
import { CreateNewAccountsController } from "@modules/accounts/useCases/CreateNewAccounts/CreateNewAccountsController";

export function makeCreateNewAccountsController(): Controller {
  const prismaUsersRepository = new PrismaUsersRepository();

  const createNewAccounts = new CreateNewAccounts(prismaUsersRepository);

  const createNewAccountsController = new CreateNewAccountsController(
    createNewAccounts
  );

  return createNewAccountsController;
}
