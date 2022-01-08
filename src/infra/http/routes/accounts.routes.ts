import { Router } from "express";
import { adaptRoute } from "@core/infra/adpters/ExpressRouteAdapter";
import { makeCreateNewAccountsController } from "../factories/controllers/CreateNewAccountsControllerFactory";

const accountsRoutes = Router();

accountsRoutes.post("/", adaptRoute(makeCreateNewAccountsController()));

export { accountsRoutes };
