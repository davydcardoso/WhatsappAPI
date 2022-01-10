import { prisma } from "@infra/prisma/connection";
import { Users } from "@modules/accounts/domain/users";
import { UsersMappers } from "@modules/accounts/mappers/UsersMapper";
import { UsersRepository } from "../UsersRepository";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<Users> {
    const user = await prisma.accounts.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return UsersMappers.toDomain(user);
  }

  async findByEmail(email: string): Promise<Users> {
    const user = await prisma.accounts.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    return UsersMappers.toDomain(user);
  }

  async exists(email: string): Promise<boolean> {
    const usersExists = await prisma.accounts.findFirst({ where: { email } });

    return !!usersExists;
  }

  async create(user: Users): Promise<void> {
    const data = await UsersMappers.toPersistence(user);

    await prisma.accounts.create({ data });
  }
}
