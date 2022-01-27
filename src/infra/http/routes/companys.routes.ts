import { adaptRoute } from "@core/infra/adpters/ExpressRouteAdapter";
import { Router } from "express";
import { makeCreateNewCompanyAccountController } from "../factories/controllers/CreateNewCompanyAccountControllerFactory";

const companysRoutes = Router();

companysRoutes.post("/", adaptRoute(makeCreateNewCompanyAccountController()));

export { companysRoutes };
