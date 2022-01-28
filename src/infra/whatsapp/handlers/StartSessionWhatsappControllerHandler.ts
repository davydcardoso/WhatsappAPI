import fs from "fs";
import QrCode from "qrcode";
import { Redis } from "ioredis";
import { logger } from "@util/logger";
import SocketClient from "socket.io-client";
import axios, { AxiosError } from "axios";
import { Client, ClientSession } from "whatsapp-web.js";
import { generate as QrCodeGenerate } from "qrcode-terminal";
import { WhatsappHandler } from "@core/infra/WhatsappHandler";
import { CompanysRepository } from "@modules/companys/repositories/CompanysRepository";

type StartSessionWhatsappHandlerResponse = {
  session: Client;
  sessionData: ClientSession;
  tokenAccount: string;
};

export class StartSessionWhatsappHandler implements WhatsappHandler {
  constructor(
    private redis: Redis,
    private companysRepository: CompanysRepository
  ) {}

  async perform(
    companyId: string
  ): Promise<StartSessionWhatsappHandlerResponse> {
    return new Promise<StartSessionWhatsappHandlerResponse>(
      async (resolve, reject) => {
        try {
          const whatsapp = new Client({});

          let loginAttempts: number = 0;

          const { webhook } = await this.companysRepository.findById(companyId);

          const api = axios.create({
            baseURL: webhook.value
          });

          let sessionWhatsapp: ClientSession;

          whatsapp.initialize();

          const io = SocketClient(
            `${process.env.BACKEND_URL}:${process.env.PORT_WEBSOCKET}`
          );

          io.connect();

          whatsapp.on("qr", async qrcode => {
            if (process.env.LOG_QRCODE == "true") {
              QrCodeGenerate(qrcode, { small: true });
            }

            if (loginAttempts >= 5) {
              fs.unlink(`./public/qrcode/${companyId}.png`, err => {
                if (err) return;
              });
              reject(new Error("Maximum attempts reached"));
              return;
            }

            loginAttempts++;

            QrCode.toFile(
              `./public/qrcode/${companyId}.png`,
              qrcode,
              {
                color: {
                  light: "#FFF"
                }
              },
              err => {
                if (err) {
                  reject(new Error(err.message));
                  return;
                }
              }
            );

            io.emit("whatsapp.qrcode", {
              token: companyId,
              qrcode: qrcode
            });

            // await api
            //   .post(`/${webhookToken}`, {
            //     qrcode: qrcode,
            //   })
            //   .then(() => {
            //     logger.info(
            //       `Qr code sent to webhook successfully | token: ${companyId}`
            //     );
            //   })
            //   .catch((err) => {
            //     const error = err as AxiosError;
            //     logger.error(
            //       `Error generating QR code  | token: ${companyId} ${
            //         error.response
            //           ? `Error: ${JSON.stringify(error.response.data)}`
            //           : ` ${err}`
            //       }`
            //     );
            //   });
          });

          whatsapp.on("authenticated", session => {
            sessionWhatsapp = session;
            logger.info(
              `Whatsapp successfully authenticated | token ${companyId}`
            );
            io.emit("whatsapp.authenticated", companyId);
          });

          whatsapp.on("auth_failure", message => {
            logger.error(`Error logging into whatsapp | token ${companyId}`);
            io.emit("whatsapp.auth_failure", companyId);
            reject(`Error logging into whatsapp | token ${companyId}`);
          });

          whatsapp.on("ready", async () => {
            io.emit("whatsapp.ready", companyId);

            logger.info(`Whatsapp started successfully | token ${companyId}`);
            resolve({
              session: whatsapp,
              sessionData: sessionWhatsapp,
              tokenAccount: companyId
            });
          });
        } catch (err) {
          logger.error(err.message);
        }
      }
    );
  }
}
