import { Controller } from "@core/infra/Controller";
import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/PrismaUsersRepository";
import { AuthenticationUser } from "@modules/accounts/useCases/AuthenticationUser/AuthenticationUser";
import { AuthenticationUserController } from "@modules/accounts/useCases/AuthenticationUser/AuthenticationUserController";
import { PrismaCompanysRepository } from "@modules/companys/repositories/prisma/PrismaCompanysRepository";

export function makeAuthenticationUserController(): Controller {
  const prismaUsersRepository = new PrismaUsersRepository();
  const prismaCompanysRepository = new PrismaCompanysRepository();

  const authenticationUser = new AuthenticationUser(
    prismaUsersRepository,
    prismaCompanysRepository
  );

  const authenticationUserController = new AuthenticationUserController(
    authenticationUser
  );

  return authenticationUserController;
}
