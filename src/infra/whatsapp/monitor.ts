import { adapterMessageListener } from "@core/infra/adpters/WhatsappMessageAdapter";
import { logger } from "@util/logger";
import { Client } from "whatsapp-web.js";
import { makeStartMessageWhatsappListener } from "./factories/StartMessageWhatsappListenerFactory";
import SocketClient from "socket.io-client";
import { PrismaSessionsRepository } from "@modules/sessions/repositories/prisma/PrismaSessionsRepository";

const startWhatsappMessageListener = adapterMessageListener(
  makeStartMessageWhatsappListener()
);

const prismaSessionsRepository = new PrismaSessionsRepository();

export async function startWhatsappMonitor(
  whatsapp: Client,
  token: string
): Promise<void> {
  whatsapp.on("message_create", async (message) => {
    await startWhatsappMessageListener(token, message, whatsapp);
  });

  const io = SocketClient(
    `${process.env.BACKEND_URL}:${process.env.PORT_WEBSOCKET}`
  );

  io.connect();

  whatsapp.on("ready", () => {
    io.emit("whatsapp.ready", token);
    logger.info(`Whatsapp started successfully | token ${token}`);
  });

  whatsapp.on("change_state", async (state) => {
    io.emit("whatsapp.change_state", token);
    logger.info(`Monitor session: ${token} status: ${state}`);
  });

  whatsapp.on("disconnected", async (reason) => {
    logger.info(`Disconnected session: ${token}, reason: ${reason}`);
    io.emit("whatsapp.disconnected", token);
    await prismaSessionsRepository.updateStatus(token, "CLOSED");
  });
}
