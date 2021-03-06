import { Controller } from "@core/infra/Controller";
import { clientError, fail, HttpResponse, ok } from "@core/infra/HttpResponse";
import { SendWhatsappMediaMessage } from "./SendWhatsappMediaMessage";

type SendWhatsappMediaMessageControllerRequest = {
  companyId: string;
  to: string;
  contents: {
    media_type: string;
    media: string;
  };
};

export class SendWhatsappMediaMessageController implements Controller {
  constructor(private sendWhatsappMediaMessage: SendWhatsappMediaMessage) {}

  async handle(
    request: SendWhatsappMediaMessageControllerRequest
  ): Promise<HttpResponse> {
    try {
      const { companyId, to, contents } = request;

      const result = await this.sendWhatsappMediaMessage.perform({
        companyId,
        to,
        contents,
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
