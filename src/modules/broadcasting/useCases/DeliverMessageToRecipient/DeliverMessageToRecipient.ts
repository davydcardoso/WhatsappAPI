import { IMailProvider } from "@infra/providers/models/IMailProvider";
import { IDeliverMessageJob } from "@modules/broadcasting/jobs/IDeliverMessageJob";
import { logger } from "@util/logger";

type DeliverMessageToRecipientRequest = IDeliverMessageJob;

export class DeliverMessageToRecipient {
  constructor(private mailProvider: IMailProvider) {}

  async execute({
    recipient,
    message,
    sender,
  }: DeliverMessageToRecipientRequest): Promise<void> {
    await this.mailProvider
      .sendEmail(
        {
          from: {
            name: sender.name,
            email: sender.email,
          },
          to: {
            name: recipient.name,
            email: recipient.email,
          },
          subject: message.subject,
          body: message.body,
        },
        {
          messageId: message.id,
          contactId: recipient.id,
        }
      )
      .catch((err) => {
        logger.error(`Erro ao enviar e-mail | Error: ${err.message}`);
      });
  }
}
