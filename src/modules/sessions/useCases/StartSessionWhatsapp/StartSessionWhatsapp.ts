import { adapterWhatsapp } from "@core/infra/adpters/WhatsappHandlerAdapter";
import { Either, left, right } from "@core/logic/Either";
import { makeStartSessionWhatsappHandler } from "@infra/whatsapp/factories/StartSessionWhatsappHandlerFactory";
import { startWhatsappMonitor } from "@infra/whatsapp/monitor";
import { SessionsRepository } from "@modules/sessions/repositories/SessionsRepository";
import { Client, ClientSession } from "whatsapp-web.js";
import { SessionAlreadyStartedError } from "./errors/SessionAlreadyStartedError";
import SocketClient from "socket.io-client";

type StartSessionWhatsappRequest = {
  userId: string;
};

type SessionAlreadyStartedData = {
  WABrowserId: string;
  WASecretBundle: string;
  WAToken1: string;
  WAToken2: string;
};

type StartSessionWhatsappHandlerResponse = {
  session: Client;
  sessionData: ClientSession;
  tokenAccount: string;
};

type StartSessionWhatsappResponse = Either<Error, Object>;

export class StartSessionWhatsapp {
  constructor(private sessionsRepository: SessionsRepository) {}

  async perform({
    userId,
  }: StartSessionWhatsappRequest): Promise<StartSessionWhatsappResponse> {
    const session = await this.sessionsRepository.findByAccountId(userId);

    let whatsappSession: StartSessionWhatsappHandlerResponse;

    const startSessionWhatsapp = adapterWhatsapp(
      makeStartSessionWhatsappHandler()
    );

    if (!session) {
      const io = SocketClient(
        `${process.env.BACKEND_URL}:${process.env.PORT_WEBSOCKET}`
      );

      io.connect();

      io.emit("whatsapp.start-session", userId);

      // whatsappSession = await startSessionWhatsapp(userId);

      // const { WABrowserId, WASecretBundle, WAToken1, WAToken2 } =
      //   whatsappSession.sessionData;

      // const sessionOrError = Sessions.create({
      //   status: "STARTED",
      //   accountId: userId,
      //   wa_browser_id: WABrowserId,
      //   wa_secret_bundle: WASecretBundle,
      //   wa_token1: WAToken1,
      //   wa_token2: WAToken2,
      // });

      // if (sessionOrError.isLeft()) {
      //   return left(new InvalidSessionWhatsappError());
      // }

      // await this.sessionsRepository.create(sessionOrError.value);
    } else {
      if (session.status === "STARTED") {
        return left(new SessionAlreadyStartedError());
      }

      const sessionAlreadyStarted: SessionAlreadyStartedData = {
        WABrowserId: session.waBrowserId,
        WASecretBundle: session.waSecretBundle,
        WAToken1: session.waToken1,
        WAToken2: session.waToken2,
      };

      await startWhatsappMonitor(
        new Client({
          session: sessionAlreadyStarted,
        }),
        userId
      );
    }

    // await startWhatsappMonitor(whatsappSession.session, userId);

    return right({});
  }
}
