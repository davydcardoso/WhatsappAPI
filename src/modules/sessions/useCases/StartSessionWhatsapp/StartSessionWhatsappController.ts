import { Controller } from "@core/infra/Controller";
import { clientError, fail, HttpResponse, ok } from "@core/infra/HttpResponse";
import { StartSessionWhatsapp } from "./StartSessionWhatsapp";

type StartSessionWhatsappControllerRequest = {
  companyId: string;
};

export class StartSessionWhatsappController implements Controller {
  constructor(private startSessionWhatsapp: StartSessionWhatsapp) {}

  async handle(
    request: StartSessionWhatsappControllerRequest
  ): Promise<HttpResponse> {
    try {
      const { companyId } = request;

      const result = await this.startSessionWhatsapp.perform({
        companyId,
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
