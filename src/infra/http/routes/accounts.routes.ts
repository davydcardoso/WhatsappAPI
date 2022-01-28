import { Router } from "express";
import { adaptRoute } from "@core/infra/adpters/ExpressRouteAdapter";
import { makeCreateNewAccountsController } from "../factories/controllers/CreateNewAccountsControllerFactory";
import { adaptMiddleware } from "@core/infra/adpters/ExpressMiddlewareAdapter";
import { makeEnsureAuthenticatedMiddleware } from "../factories/middlewares/EnsureAuthenticatedMiddlewareFactory";

const accountsRoutes = Router();

accountsRoutes.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()));

accountsRoutes.post("/", adaptRoute(makeCreateNewAccountsController()));

export { accountsRoutes };
