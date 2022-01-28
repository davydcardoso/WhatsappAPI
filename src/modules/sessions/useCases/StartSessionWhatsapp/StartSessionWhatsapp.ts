import { Either, left, right } from "@core/logic/Either";
import { startWhatsappMonitor } from "@infra/whatsapp/monitor";
import { SessionsRepository } from "@modules/sessions/repositories/SessionsRepository";
import { Client } from "whatsapp-web.js";
import { SessionAlreadyStartedError } from "./errors/SessionAlreadyStartedError";
import SocketClient from "socket.io-client";

type StartSessionWhatsappRequest = {
  companyId: string;
};

type SessionAlreadyStartedData = {
  WABrowserId: string;
  WASecretBundle: string;
  WAToken1: string;
  WAToken2: string;
};

type StartSessionWhatsappResponse = Either<Error, Object>;

export class StartSessionWhatsapp {
  constructor(private sessionsRepository: SessionsRepository) {}

  async perform({
    companyId
  }: StartSessionWhatsappRequest): Promise<StartSessionWhatsappResponse> {
    const session = await this.sessionsRepository.findByCompanyId(companyId);

    if (!session) {
      const io = SocketClient(
        `${process.env.BACKEND_URL}:${process.env.PORT_WEBSOCKET}`
      );

      io.connect();

      io.emit("whatsapp.start-session", companyId);
    } else {
      if (session.status === "STARTED") {
        return left(new SessionAlreadyStartedError());
      }

      const sessionAlreadyStarted: SessionAlreadyStartedData = {
        WABrowserId: session.waBrowserId,
        WASecretBundle: session.waSecretBundle,
        WAToken1: session.waToken1,
        WAToken2: session.waToken2
      };

      await startWhatsappMonitor(
        new Client({
          session: sessionAlreadyStarted
        }),
        companyId
      );
    }

    // await startWhatsappMonitor(whatsappSession.session, userId);

    return right({});
  }
}
