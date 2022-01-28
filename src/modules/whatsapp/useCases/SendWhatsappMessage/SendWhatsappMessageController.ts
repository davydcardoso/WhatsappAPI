import { Controller } from "@core/infra/Controller";
import { clientError, fail, HttpResponse, ok } from "@core/infra/HttpResponse";
import { SendWhatsappMessage } from "./SendWhatsappMessage";

type SendWhatsappMessageControllerRequest = {
  companyId: string;
  to: string;
  message: string;
};

export class SendWhatsappMessageController implements Controller {
  constructor(private sendWhatsappMessage: SendWhatsappMessage) {}

  async handle(
    request: SendWhatsappMessageControllerRequest
  ): Promise<HttpResponse> {
    try {
      const { companyId, to, message } = request;

      const result = await this.sendWhatsappMessage.perform({
        companyId,
        to,
        message,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return clientError(error);
        }
      }

      return ok();
    } catch (err) {
      return fail(err);
    }
  }
}
