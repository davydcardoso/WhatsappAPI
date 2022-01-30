import { Messages } from "../domain/messages/messages";

export class MessagesMappers {
  static toPersistence(raw: Messages) {
    return {
      company_id: raw.companyId,
      ack: raw.ack,
      read: raw.read,
      from_me: raw.fromMe,
      body: raw.body,
      is_media: raw.isMedia,
      is_deleted: raw.isDeleted
    };
  }
}
