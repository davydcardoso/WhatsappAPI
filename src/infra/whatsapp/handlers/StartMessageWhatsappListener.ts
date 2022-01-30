import { WhatsappMessageListener } from "@core/infra/WhatsappListener";
import { CompanysRepository } from "@modules/companys/repositories/CompanysRepository";
import { Messages } from "@modules/whatsapp/domain/messages/messages";
import { MessagesRepository } from "@modules/whatsapp/repositories/MessagesRepository";
import { logger } from "@util/logger";
import axios from "axios";
import { Message, Client } from "whatsapp-web.js";

type WebhookResponseHeaders = {
  token: string;
  message_id: string;
};

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
  constructor(
    private companysRepository: CompanysRepository,
    private messagesRepository: MessagesRepository
  ) {}

  async perform(token: string, message: Message): Promise<void> {
    if (message.fromMe) {
      return;
    }

    const { webhook, ambient } = await this.companysRepository.findById(token);

    const contact = await message.getContact();
    const media = await message.downloadMedia();

    if (ambient === "SANDBOX") {
      const messagesOrError = Messages.create({
        companyId: token,
        ack: message.ack,
        body: message.body,
        fromMe: message.fromMe,
        isDeleted: false,
        isMedia: message.hasMedia,
        read: false
      });

      if (messagesOrError.isRight()) {
        await this.messagesRepository.create(messagesOrError.value);
      }
    }

    if (!webhook) {
      logger.warn(`Client does not have a registered webhook | token ${token}`);
      return;
    }

    if (webhook.value === "http://localhost") {
      logger.warn(`Client does not have a registered webhook | token ${token}`);
      return;
    }

    const api = axios.create({
      baseURL: webhook.value,
      headers: {
        token: token,
        message_id: message.id.id
      }
    });

    api
      .post(`/webhook/hiperion`, {
        from: message.from,
        data: {
          contact: {
            id: JSON.stringify(contact.id),
            name: contact.name ? contact.name : "",
            pushname: contact.pushname ? contact.pushname : ""
          },
          message: {
            is_media: message.hasMedia,
            contents: message.body,
            media: message.hasMedia
              ? {
                  media_url: media.filename ? media.filename : "",
                  media_type: media.mimetype ? media.mimetype : "",
                  data: media.data ? JSON.stringify(media.data) : ""
                }
              : null
          }
        }
      })
      .then(response => {
        if (response.status == 200) {
        }
      })
      .catch(() => {
        logger.error(`Error sending message to webhook | token ${token} `);
      });
  }
}
