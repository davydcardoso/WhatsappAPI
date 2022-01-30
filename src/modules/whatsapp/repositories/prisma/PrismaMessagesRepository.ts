import { prisma } from "@infra/prisma/connection";
import { Messages } from "@modules/whatsapp/domain/messages/messages";
import { MessagesMappers } from "@modules/whatsapp/mappers/MessagesMappers";
import { MessagesRepository } from "../MessagesRepository";

export class PrismaMessagesRepository implements MessagesRepository {
  async create(message: Messages): Promise<void> {
    const data = MessagesMappers.toPersistence(message);

    await prisma.messages.create({ data });
  }
}
