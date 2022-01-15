import { Controller } from "@core/infra/Controller";
import { clientError, fail, HttpResponse, ok } from "@core/infra/HttpResponse";
import { AuthenticationUser } from "./AuthenticationUser";
import { InvalidMethodAuthenticationError } from "./errors/InvalidMethodAuthenticationError";

type AuthenticationUserControllerRequest = {
  authorization: string;
};

export class AuthenticationUserController implements Controller {
  constructor(private authenticationUser: AuthenticationUser) {}

  async handle(
    request: AuthenticationUserControllerRequest
  ): Promise<HttpResponse> {
    try {
      const { authorization } = request;

      const [method, data] = authorization.split(" ");

      const credentials = Buffer.from(data, "base64").toString("ascii");

      const [username, password] = credentials.split(":");

      if (method.trim() !== "Basic") {
        return clientError(new InvalidMethodAuthenticationError());
      }

      const result = await this.authenticationUser.perform({
        username,
        password,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return clientError(error);
        }
      }
      
      return ok(result.value);
    } catch (err) {
      return fail(err);
    }
  }
}
