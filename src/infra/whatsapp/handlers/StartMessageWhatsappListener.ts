import { WhatsappMessageListener } from "@core/infra/WhatsappListener";
import { UsersRepository } from "@modules/accounts/repositories/UsersRepository";
import { logger } from "@util/logger";
import axios, { AxiosError } from "axios";
import { Message, Client } from "whatsapp-web.js";

export class StartMessageWhatsappListener implements WhatsappMessageListener {
  constructor(private usersRepository: UsersRepository) {}

  async perform(
    token: string,
    message: Message,
    whatsapp: Client
  ): Promise<void> {
    if (message.fromMe) {
      return;
    }

    const { webhook, webhookToken } = await this.usersRepository.findById(
      token
    );

    if (webhook.value === "http://localhost") {
      logger.warn(`Client does not have a registered webhook | token ${token}`);
      return;
    }

    const api = axios.create({
      baseURL: webhook.value,
    });

    api
      .post(`/${webhookToken}`, {
        from: message.from,
        message: message.body,
      })
      .then((response) => {
        if (response.status == 200) {
        }
      })
      .catch(() => {
        logger.error(`Error sending message to webhook | token ${token} `);
      });
  }
}
