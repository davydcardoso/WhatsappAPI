import { prisma } from "@infra/prisma/connection";
import { Sessions } from "@modules/sessions/domain/sessions";
import { SessionsMapper } from "@modules/sessions/mappers/SessionsMappers";
import { SessionsRepository } from "../SessionsRepository";

export class PrismaSessionsRepository implements SessionsRepository {
  async create(session: Sessions): Promise<void> {
    const data = SessionsMapper.toPersistence(session);

    await prisma.sessions.create({ data });
  }

  async updateStatus(companys_id: string, status: string): Promise<void> {
    await prisma.sessions.update({ where: { companys_id }, data: { status } });
  }

  async findByCompanyId(companys_id: string): Promise<Sessions> {
    const sessions = await prisma.sessions.findUnique({
      where: { companys_id }
    });

    if (!sessions) {
      return null;
    }

    return SessionsMapper.toDomain(sessions);
  }

  async delete(companys_id: string): Promise<void> {
    await prisma.sessions.delete({ where: { companys_id } });
  }

  async findMany(): Promise<Sessions[]> {
    const sessions = await prisma.sessions.findMany({});

    return sessions.map(session => SessionsMapper.toDomain(session));
  }
}
