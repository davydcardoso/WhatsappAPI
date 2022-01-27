import { prisma } from "@infra/prisma/connection";
import { Companys } from "@modules/companys/domain/companys";
import { CompanysMappers } from "@modules/companys/mappers/CompanysMappers";
import { v4 } from "uuid";
import { CompanysRepository } from "../CompanysRepository";

export class PrismaCompanysRepository implements CompanysRepository {
  async exists(email: string): Promise<boolean> {
    const exists = await prisma.companys.findUnique({
      where: { email }
    });

    return !!exists;
  }

  async create(companys: Companys): Promise<void> {
    const data = CompanysMappers.toPersistence(companys);

    await prisma.companys.create({ data });
  }
}
