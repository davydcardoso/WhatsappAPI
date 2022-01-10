import { WhatsappHandler } from "@core/infra/WhatsappHandler";
import { Client, ClientSession } from "whatsapp-web.js";
import QrCode from "qrcode-terminal";
import { logger } from "@util/logger";
import SocketClient from "socket.io-client";

type StartSessionWhatsappHandlerResponse = {
  session: Client;
  sessionData: ClientSession;
  tokenAccount: string;
};

export class StartSessionWhatsappHandler implements WhatsappHandler {
  async perform(
    accountId: string
  ): Promise<StartSessionWhatsappHandlerResponse> {
    return new Promise<StartSessionWhatsappHandlerResponse>(
      async (resolve, reject) => {
        try {
          const whatsapp = new Client({});

          let sessionWhatsapp: ClientSession;

          whatsapp.initialize();

          const io = SocketClient(
            `${process.env.BACKEND_URL}:${process.env.PORT_WEBSOCKET}`
          );

          io.connect();

          whatsapp.on("qr", (qrcode) => {
            if (process.env.LOG_QRCODE) {
              QrCode.generate(qrcode, { small: true });
            }

            io.emit("whatsapp.qrcode", {
              token: accountId,
              qrcode: qrcode,
            });
          });

          whatsapp.on("authenticated", (session) => {
            sessionWhatsapp = session;
            logger.info(
              `Whatsapp successfully authenticated | token ${accountId}`
            );
            io.emit("whatsapp.authenticated", accountId);
          });

          whatsapp.on("auth_failure", (message) => {
            logger.error(`Error logging into whatsapp | token ${accountId}`);
            io.emit("whatsapp.auth_failure", accountId);
            reject(`Error logging into whatsapp | token ${accountId}`);
          });

          whatsapp.on("ready", async () => {
            io.emit("whatsapp.ready", accountId);

            logger.info(`Whatsapp started successfully | token ${accountId}`);
            resolve({
              session: whatsapp,
              sessionData: sessionWhatsapp,
              tokenAccount: accountId,
            });
          });
        } catch (err) {
          logger.error(err.message);
        }
      }
    );
  }
}
