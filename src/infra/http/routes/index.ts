import { Router } from "express";
import { accountsRoutes } from "./accounts.routes";
import { authRoutes } from "./auth.routes";
import { companysRoutes } from "./companys.routes";
import { whatsappRoutes } from "./whatsapp.routes";

const routes = Router();

routes.use("/companys", companysRoutes);
routes.use("/auth", authRoutes);
routes.use("/accounts", accountsRoutes);
routes.use("/whatsapp", whatsappRoutes);

export { routes };
