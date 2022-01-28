import { Controller } from "@core/infra/Controller";
import {
  clientError,
  created,
  fail,
  HttpResponse
} from "@core/infra/HttpResponse";
import { CreateNewAccounts } from "./CreateNewAccounts";

type CreateNewAccountsControllerRequest = {
  userId: string;
  companyId: string;
  name: string;
  email: string;
  password: string;
  userAdmin: boolean;
};

export class CreateNewAccountsController implements Controller {
  constructor(private createNewAccounts: CreateNewAccounts) {}

  async handle(
    request: CreateNewAccountsControllerRequest
  ): Promise<HttpResponse> {
    try {
      if (!request.userAdmin) {
        return clientError(
          new Error("Your account is not permission create a new users")
        );
      }

      const { name, email, password, companyId } = request;

      const result = await this.createNewAccounts.perform({
        name,
        email,
        password,
        companyId,
        isAdministrator: false
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
