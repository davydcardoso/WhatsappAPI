import { WhatsappMessageListener } from "@core/infra/WhatsappListener";
import { UsersRepository } from "@modules/accounts/repositories/UsersRepository";
import { logger } from "@util/logger";
import axios, { AxiosError } from "axios";
import { Message, Client } from "whatsapp-web.js";

type WebhookResponseHeaders = {
  token: string;
  message_id: string
}

type WebhookResponseData = {
  from: string;
  data: {
    contact: {
      id: string;
      name: string;
      pushname: string;
    };
    message: {
      is_media: boolean;
      contents: string;
      media: {
        media_url: string;
        media_type: string;
        data: object;
      } | null;
    };
  };
};

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

    const contact = await message.getContact();
    const media = await message.downloadMedia();

    const api = axios.create({
      baseURL: webhook.value,
      headers: {
        token: token,
        message_id: message.id.id,
      },
    });

    api
      .post(`/${webhookToken}`, {
        from: message.from,
        data: {
          contact: {
            id: JSON.stringify(contact.id),
            name: contact.name ? contact.name : "",
            pushname: contact.pushname ? contact.pushname : "",
          },
          message: {
            is_media: message.hasMedia,
            contents: message.body,
            media: message.hasMedia
              ? {
                  media_url: media.filename ? media.filename : "",
                  media_type: media.mimetype ? media.mimetype : "",
                  data: media.data ? JSON.stringify(media.data) : "",
                }
              : null,
          },
        },
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
