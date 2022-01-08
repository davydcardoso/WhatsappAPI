import { Controller } from "@core/infra/Controller";
import {
  clientError,
  created,
  fail,
  HttpResponse,
} from "@core/infra/HttpResponse";
import { CreateNewAccounts } from "./CreateNewAccounts";

type CreateNewAccountsControllerRequest = {
  name: string;
  email: string;
  password: string;
  phone: string;
  document?: string;
};

export class CreateNewAccountsController implements Controller {
  constructor(private createNewAccounts: CreateNewAccounts) {}

  async handle(
    request: CreateNewAccountsControllerRequest
  ): Promise<HttpResponse> {
    try {
      const { name, email, password, phone, document } = request;

      const result = await this.createNewAccounts.perform({
        name,
        email,
        password,
        phone,
        document,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return clientError(error);
        }
      }

      return created(result.value);
    } catch (err) {
      return fail(err);
    }
  }
}
