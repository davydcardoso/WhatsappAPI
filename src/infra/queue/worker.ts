/* eslint-disable import/first */
import "@config/bootstrap";

import { nodemailerConfig } from "@config/nodemailer";
import { MailtrapProvider } from "@infra/providers/implementations/mail/MailtrapProvider";
import { BullProvider } from "@infra/providers/implementations/queue/BullProvider";
import { DeliverMessageToRecipient } from "@modules/broadcasting/useCases/DeliverMessageToRecipient/DeliverMessageToRecipient";

const mailQueueProvider = new BullProvider();
const mailtrapProvider = new MailtrapProvider(nodemailerConfig);
const deliverMessageToRecipient = new DeliverMessageToRecipient(mailtrapProvider);

mailQueueProvider.process(async ({ data }) => {
  await deliverMessageToRecipient.execute(data);
});
