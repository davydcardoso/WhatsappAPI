import { Router } from "express";
import { accountsRoutes } from "./accounts.routes";
import { authRoutes } from "./auth.routes";
import { whatsappRoutes } from "./whatsapp.routes";

const routes = Router();

routes.use("/accounts", accountsRoutes);
routes.use("/auth", authRoutes);
routes.use("/whatsapp", whatsappRoutes);

export { routes };
