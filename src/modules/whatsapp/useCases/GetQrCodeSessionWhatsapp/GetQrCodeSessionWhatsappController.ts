import { Controller } from "@core/infra/Controller";
import { clientError, fail, HttpResponse, ok } from "@core/infra/HttpResponse";
import { QrCodeImageNotFoundError } from "./errors/QrCodeImageNotFoundError";
import { GetQrCodeSessionWhatsapp } from "./GetQrCodeSessionWhatsapp";

type GetQrCodeSessionWhatsappControllerRequest = {
  userId: string;
};

export class GetQrCodeSessionWhatsappController implements Controller {
  constructor(private getQrCodeSessionWhatsapp: GetQrCodeSessionWhatsapp) {}

  async handle(
    request: GetQrCodeSessionWhatsappControllerRequest
  ): Promise<HttpResponse> {
    try {
      const { userId } = request;

      const result = await this.getQrCodeSessionWhatsapp.perform({
        userId,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return clientError(error);
        }
      }

      const { qrcode } = result.value;

      return ok({ qrcode });
    } catch (err) {

      switch (err.constructor) {
        case QrCodeImageNotFoundError:
          return clientError(err);
        default:
          return fail(err);
      }


      return fail(err);
    }
  }
}
