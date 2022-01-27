import { Controller } from "@core/infra/Controller";
import { BullProvider } from "@infra/providers/implementations/queue/BullProvider";
import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/PrismaUsersRepository";
import { CreateNewAccounts } from "@modules/accounts/useCases/CreateNewAccounts/CreateNewAccounts";
import { PrismaCompanysRepository } from "@modules/companys/repositories/prisma/PrismaCompanysRepository";
import { CreateNewCompanyAccount } from "@modules/companys/useCases/CreateNewCompanyAccount/CreateNewCompanyAccount";
import { CreateNewCompanyAccountController } from "@modules/companys/useCases/CreateNewCompanyAccount/CreateNewCompanyAccountController";

export function makeCreateNewCompanyAccountController(): Controller {
  const prismaCompanysRepository = new PrismaCompanysRepository();
  const prismaUsersRepository = new PrismaUsersRepository();
  const bullProvider = new BullProvider();

  const createNewAccounts = new CreateNewAccounts(prismaUsersRepository);

  const createNewCompanyAccount = new CreateNewCompanyAccount(
    prismaCompanysRepository,
    bullProvider,
    createNewAccounts
  );

  const createNewCompanyAccountController =
    new CreateNewCompanyAccountController(createNewCompanyAccount);

  return createNewCompanyAccountController;
}
