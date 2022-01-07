import { verify } from "jsonwebtoken";
import {
  HttpResponse,
  fail,
  forbidden,
  ok,
} from "../../../core/infra/HttpResponse";
import { Middleware } from "../../../core/infra/Middleware";
import { AccessDeniedError } from "./errors/AccessDeniedError";
import authConfig from "@config/auth";

type EnsureAuthenticatedMiddlewareRequest = {
  accessToken: string;
};

type TokenPayload = {
  companyId: string;
  username: string;
  isAdmin: string;
  iat: number;
  exp: number;
  sub: string;
};

export class EnsureAuthenticatedMiddleware implements Middleware {
  async handle({
    accessToken,
  }: EnsureAuthenticatedMiddlewareRequest): Promise<HttpResponse> {
    try {
      if (accessToken) {
        const [, token] = accessToken.split(" ");

        try {
          const tokenDecoded = verify(token, authConfig.secret);
          const { isAdmin, sub } = tokenDecoded as TokenPayload;

          return ok({
            userId: sub,
            isAdmin: isAdmin,
          });
        } catch (err) {
          return forbidden(err);
        }
      }

      return forbidden(new AccessDeniedError());
    } catch (err) {
      return fail(err);
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string;
  };
}
