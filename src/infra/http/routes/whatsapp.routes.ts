import { adaptMiddleware } from "@core/infra/adpters/ExpressMiddlewareAdapter";
import { adaptRoute } from "@core/infra/adpters/ExpressRouteAdapter";
import { Router } from "express";
import { makeSendWhatsappMessageController } from "../factories/controllers/SendWhatsappMessageControllerFactory";
import { makeStartSessionWhatsappController } from "../factories/controllers/StartSessionWhatsappControllerFactory";
import { makeEnsureAuthenticatedMiddleware } from "../factories/middlewares/EnsureAuthenticatedMiddlewareFactory";

const whatsappRoutes = Router();

whatsappRoutes.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()));

whatsappRoutes.get("/qrcode", adaptRoute(makeStartSessionWhatsappController()));

whatsappRoutes.post(
  "/message/text",
  adaptRoute(makeSendWhatsappMessageController())
);

export { whatsappRoutes };
