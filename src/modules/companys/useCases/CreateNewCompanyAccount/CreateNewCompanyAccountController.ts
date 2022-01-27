import { Controller } from "@core/infra/Controller";
import { clientError, created, fail, HttpResponse, ok } from "@core/infra/HttpResponse";
import { CreateNewCompanyAccount } from "./CreateNewCompanyAccount";

type CreateNewCompanyAccountControllerRequest = {
  name: string;
  fantasyName: string;
  document: string;
  email: string;
  phone: string;
  webhook: string;
};

export class CreateNewCompanyAccountController implements Controller {
  constructor(private createNewCompanyAccount: CreateNewCompanyAccount) {}

  async handle(
    request: CreateNewCompanyAccountControllerRequest
  ): Promise<HttpResponse> {
    try {
      const { name, fantasyName, document, email, phone, webhook } = request;

      const result = await this.createNewCompanyAccount.perform({
        name,
        fantasyName,
        document,
        email,
        phone,
        webhook
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return clientError(error);
        }
      }

      return created();
    } catch (err) {
      return fail(err);
    }
  }
}
