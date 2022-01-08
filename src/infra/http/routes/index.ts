import { Router } from "express";
import { accountsRoutes } from "./accounts.routes";

const routes = Router();

routes.use("/accounts", accountsRoutes);

export { routes };
