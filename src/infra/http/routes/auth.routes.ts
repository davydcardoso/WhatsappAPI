import { adaptRoute } from "@core/infra/adpters/ExpressRouteAdapter";
import { Router } from "express";
import { makeAuthenticationUserController } from "../factories/controllers/AuthenticationUserControllerFactory";

const authRoutes = Router();

authRoutes.post("/signin", adaptRoute(makeAuthenticationUserController()));

export { authRoutes };
