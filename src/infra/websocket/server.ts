import "@config/bootstrap";
import { Server as SocketServer } from "socket.io";
import { createServer as HttpServer } from "http";
import { logger } from "@util/logger";

const httpServer = HttpServer();

type GenerateQrCodeData = {
  token: string;
  qrcode: string;
};

let socketIo = new SocketServer(httpServer, {
  cors: {
    origin: "*",
  },
});

socketIo.on("connection", (socket) => {
  logger.info(`Client successfully connected to socket | id: ${socket.id}`);

  socket.on("whatsapp.qrcode", (data: GenerateQrCodeData) => {
    logger.info(`QR Code successfully generated | token ${data.token}`);
  });

  socket.on("whatsapp.authenticated", (token) => {
    logger.info(`Whatsapp successfully authenticated | token ${token}`);
  });

  socket.on("whatsapp.auth_failure", (token) => {
    logger.error(`Error logging into whatsapp | token ${token}`);
  });

  socket.on("whatsapp.ready", (token) => {
    logger.info(`Whatsapp started successfully | token ${token}`);
  });

  socket.on("whatsapp.change_state", (token) => {
    logger.info(`Monitor session:  ${token}`);
  });

  socket.on("whatsapp.disconnected", (token) => {
    logger.error(`Disconnected session: ${token}`);
  });

  socket.on("close", (socket) => {
    logger.warn(`Client disconnected from socket successfully`);
  });
});

httpServer.listen(process.env.PORT_WEBSOCKET, () => {
  logger.info(`Socket server started in port: ${process.env.PORT_WEBSOCKET}`);
});
