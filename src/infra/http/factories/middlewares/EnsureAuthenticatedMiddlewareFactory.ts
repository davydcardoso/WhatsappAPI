import { Middleware } from "@core/infra/Middleware";
import { EnsureAuthenticatedMiddleware } from "@infra/http/middleware/EnsureAuthenticatedMiddleware";
import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/PrismaUsersRepository";

export function makeEnsureAuthenticatedMiddleware(): Middleware {
  const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware();

  return ensureAuthenticatedMiddleware;
}
