import { Controller } from "@core/infra/Controller";
import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/PrismaUsersRepository";
import { AuthenticationUser } from "@modules/accounts/useCases/AuthenticationUser/AuthenticationUser";
import { AuthenticationUserController } from "@modules/accounts/useCases/AuthenticationUser/AuthenticationUserController";

export function makeAuthenticationUserController(): Controller {
  const prismaUsersRepository = new PrismaUsersRepository();

  const authenticationUser = new AuthenticationUser(prismaUsersRepository);

  const authenticationUserController = new AuthenticationUserController(
    authenticationUser
  );

  return authenticationUserController;
}
