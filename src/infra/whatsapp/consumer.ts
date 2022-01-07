import { logger } from "@util/logger";
import { Client } from "whatsapp-web.js";

const client = new Client({});

client.on("ready", () => {
  logger.info("Client already");
});