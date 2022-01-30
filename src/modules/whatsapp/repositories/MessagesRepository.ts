import { Messages } from "../domain/messages/messages";

export interface MessagesRepository {
    create(message: Messages): Promise<void>
}