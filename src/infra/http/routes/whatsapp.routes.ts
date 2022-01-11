import { adaptMiddleware } from "@core/infra/adpters/ExpressMiddlewareAdapter";
import { adaptRoute } from "@core/infra/adpters/ExpressRouteAdapter";
import { Router } from "express";
import { makeSendWhatsappMediaMessageController } from "../factories/controllers/SendWhatsappMediaMessageControllerFactory";
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

whatsappRoutes.post(
  "/message/media",
  adaptRoute(makeSendWhatsappMediaMessageController())
);

export { whatsappRoutes };
