import { WhatsappHandler } from "@core/infra/WhatsappHandler";
import { Client, ClientSession } from "whatsapp-web.js";
import QrCode from "qrcode-terminal";
import { logger } from "@util/logger";
import SocketClient from "socket.io-client";
import { SessionsRepository } from "@modules/sessions/repositories/SessionsRepository";
import { UsersRepository } from "@modules/accounts/repositories/UsersRepository";
import axios from "axios";

type StartSessionWhatsappHandlerResponse = {
  session: Client;
  sessionData: ClientSession;
  tokenAccount: string;
};

export class StartSessionWhatsappHandler implements WhatsappHandler {
  constructor(private usersRepository: UsersRepository) {}

  async perform(
    accountId: string
  ): Promise<StartSessionWhatsappHandlerResponse> {
    return new Promise<StartSessionWhatsappHandlerResponse>(
      async (resolve, reject) => {
        try {
          const whatsapp = new Client({});

          const { webhook, webhookToken } = await this.usersRepository.findById(
            accountId
          );

          const api = axios.create({
            baseURL: webhook.value,
          });

          let sessionWhatsapp: ClientSession;

          whatsapp.initialize();

          const io = SocketClient(
            `${process.env.BACKEND_URL}:${process.env.PORT_WEBSOCKET}`
          );

          io.connect();

          whatsapp.on("qr", (qrcode) => {
            if (process.env.LOG_QRCODE == "true") {
              QrCode.generate(qrcode, { small: true });
            }

            api
              .post(`${webhookToken}`, {
                qrcode,
              })
              .then(() => {
                logger.info(
                  `Qr code sent to webhook successfully | token: ${accountId}`
                );
              })
              .catch((err) => {
                logger.error(`Error generating QR code`);
              });

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
