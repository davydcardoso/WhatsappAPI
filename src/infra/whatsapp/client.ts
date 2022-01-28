import "@config/bootstrap";
import fs from "fs";
import { logger } from "@util/logger";
import { Sessions } from "@modules/sessions/domain/sessions";
import { adapterWhatsapp } from "@core/infra/adpters/WhatsappHandlerAdapter";
import { startWhatsappMonitor } from "./monitor";
import { Server as SocketServer } from "socket.io";
import { PrismaSessionsRepository } from "@modules/sessions/repositories/prisma/PrismaSessionsRepository";
import { createServer as HttpServer } from "http";
import { makeStartSessionWhatsappHandler } from "./factories/StartSessionWhatsappHandlerFactory";
import {
  Client,
  ClientSession as ClientSessionDto,
  MessageMedia
} from "whatsapp-web.js";
import { v4 } from "uuid";

type SessionAlreadyStartedData = {
  WABrowserId: string;
  WASecretBundle: string;
  WAToken1: string;
  WAToken2: string;
};

type SendMessageWebsocketData = {
  token: string;
  message: {
    to: string;
    message: string;
  };
};

type SendMessageMediaWebsocketData = {
  token: string;
  message: {
    to: string;
    contents: {
      media_type: string;
      media: string;
    };
  };
};

type StartSessionWhatsappHandlerResponse = {
  session: Client;
  sessionData: ClientSessionDto;
  tokenAccount: string;
};

interface ClientSession extends Client {
  token?: string;
}

const sessionsWts: ClientSession[] = [];

const httpServer = HttpServer();

type GenerateQrCodeData = {
  token: string;
  qrcode: string;
};

let socketIo = new SocketServer(httpServer, {
  cors: {
    origin: "*"
  }
});

async function main() {
  const prismaSessionsRepository = new PrismaSessionsRepository();

  const sessions = await prismaSessionsRepository.findMany();

  sessions.map(async session => {
    if (session.status === "STARTED") {
      const sessionAlreadyStarted: SessionAlreadyStartedData = {
        WABrowserId: session.waBrowserId,
        WASecretBundle: session.waSecretBundle,
        WAToken1: session.waToken1,
        WAToken2: session.waToken2
      };

      const clientStarted: ClientSession = new Client({
        session: sessionAlreadyStarted,
        puppeteer: {
          executablePath: process.env.CHROME_BIN || undefined
        }
      });

      clientStarted.initialize();

      clientStarted.token = session.accountId;

      sessionsWts.push(clientStarted);

      logger.info(`Starting session: ${session.accountId}`);

      await startWhatsappMonitor(clientStarted, session.accountId);
    }
  });
}

socketIo.on("connection", socket => {
  logger.info(`Client successfully connected to socket | id: ${socket.id}`);

  socket.on("whatsapp.qrcode", (data: GenerateQrCodeData) => {
    logger.info(`QR Code successfully generated | token ${data.token}`);
  });

  socket.on("whatsapp.authenticated", token => {
    logger.info(`Whatsapp successfully authenticated | token ${token}`);
  });

  socket.on("whatsapp.auth_failure", token => {
    logger.error(`Error logging into whatsapp | token ${token}`);
  });

  socket.on("whatsapp.ready", token => {
    logger.info(`Whatsapp started successfully | token ${token}`);
  });

  socket.on("whatsapp.change_state", token => {
    logger.info(`Monitor session:  ${token}`);
  });

  socket.on("whatsapp.disconnected", token => {
    logger.error(`Disconnected session: ${token}`);
  });

  socket.on("close", socket => {
    logger.warn(`Client disconnected from socket successfully`);
  });

  socket.on("whatsapp.start-session", async token => {
    try {
      const startSessionWhatsapp = adapterWhatsapp(
        makeStartSessionWhatsappHandler()
      );

      const prismaSessionsRepository = new PrismaSessionsRepository();

      let whatsappSessionObj: StartSessionWhatsappHandlerResponse;

      whatsappSessionObj = await startSessionWhatsapp(token);

      const newSession: ClientSession = whatsappSessionObj.session;

      newSession.token = token;

      sessionsWts.push(newSession);

      const { WABrowserId, WASecretBundle, WAToken1, WAToken2 } =
        whatsappSessionObj.sessionData;

      const sessionOrError = Sessions.create({
        status: "STARTED",
        companyId: token,
        wa_browser_id: WABrowserId,
        wa_secret_bundle: WASecretBundle,
        wa_token1: WAToken1,
        wa_token2: WAToken2
      });

      if (sessionOrError.isLeft()) {
        throw new Error(sessionOrError.value.message);
      }

      await prismaSessionsRepository.create(sessionOrError.value);

      await startWhatsappMonitor(newSession, token);
    } catch (err) {
      logger.error(err.message);
    }
  });

  socket.on(
    "whatsapp.send-message-media",
    async (data: SendMessageMediaWebsocketData) => {
      try {
        const sessionIndex = sessionsWts.findIndex(s => (s.token = data.token));

        const { to, contents } = data.message;

        new Promise<void>((resolve, reject) => {
          const fileNameUUID = v4().toUpperCase();

          fs.writeFile(
            `./public/${fileNameUUID}.${contents.media_type}`,
            contents.media,
            "base64",
            async err => {
              if (err) {
                logger.error(`Error in send file | token: ${data.token}`);
                reject(err);
              }

              const newMediaFile = MessageMedia.fromFilePath(
                `./public/${fileNameUUID}.${contents.media_type}`
              );

              await sessionsWts[sessionIndex]
                .sendMessage(`${to}@c.us`, newMediaFile, {
                  sendAudioAsVoice: true
                })
                .catch(err => {
                  logger.error(
                    `Error in send message file | Error: ${err.message}`
                  );
                });

              fs.unlinkSync(`./public/${fileNameUUID}.${contents.media_type}`);

              resolve();
            }
          );
        });
      } catch (err) {
        logger.error(`Error sending message | Erro: ${err.message}`);
      }
    }
  );

  socket.on("whatsapp.send-message", async (data: SendMessageWebsocketData) => {
    try {
      const sessionIndex = sessionsWts.findIndex(s => (s.token = data.token));

      const { to, message } = data.message;

      await sessionsWts[sessionIndex].sendMessage(`${to}@c.us`, message, {
        linkPreview: false
      });
    } catch (err) {
      logger.error(`Error sending message | Erro: ${err.message}`);
    }
  });
});

httpServer.listen(process.env.PORT_WEBSOCKET, () => {
  logger.info(`Socket server started in port: ${process.env.PORT_WEBSOCKET}`);
});

main();
