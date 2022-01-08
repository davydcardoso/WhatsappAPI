import { prisma } from "@infra/prisma/connection";
import { Users } from "@modules/accounts/domain/users";
import { UsersMappers } from "@modules/accounts/mappers/UsersMapper";
import { UsersRepository } from "../UsersRepository";

export class PrismaUsersRepository implements UsersRepository {
  async exists(email: string): Promise<boolean> {
    const usersExists = await prisma.accounts.findFirst({ where: { email } });

    return !!usersExists;
  }

  async create(user: Users): Promise<void> {
    const data = await UsersMappers.toPersistence(user);

    await prisma.accounts.create({ data });
  }
}
