import { prisma } from "@infra/prisma/connection";
import { Sessions } from "@modules/sessions/domain/sessions";
import { SessionsMapper } from "@modules/sessions/mappers/SessionsMappers";
import { SessionsRepository } from "../SessionsRepository";

export class PrismaSessionsRepository implements SessionsRepository {
  async create(session: Sessions): Promise<void> {
    const data = SessionsMapper.toPersistence(session);

    await prisma.sessions.create({ data });
  }

  async updateStatus(account_id: string, status: string): Promise<void> {
    await prisma.sessions.update({ where: { account_id }, data: { status } });
  }

  async findByAccountId(account_id: string): Promise<Sessions> {
    const sessions = await prisma.sessions.findUnique({
      where: { account_id },
    });

    if (!sessions) {
      return null;
    }

    return SessionsMapper.toDomain(sessions);
  }

  async findMany(): Promise<Sessions[]> {
    const sessions = await prisma.sessions.findMany({});

    return sessions.map((session) => SessionsMapper.toDomain(session));
  }
}
