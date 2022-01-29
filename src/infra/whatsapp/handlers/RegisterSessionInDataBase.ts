import { WhatsappHandler } from "@core/infra/WhatsappHandler";
import { right } from "@core/logic/Either";
import { Sessions } from "@modules/sessions/domain/sessions";
import { SessionsRepository } from "@modules/sessions/repositories/SessionsRepository";
import { Client, ClientSession as ClientSessionDto } from "whatsapp-web.js";

type StartSessionWhatsappHandlerRequest = {
  session: Client;
  sessionData: ClientSessionDto;
  tokenAccount: string;
};

export class RegisterSessionInDataBaseHandler implements WhatsappHandler {
  constructor(private sessionsRepository: SessionsRepository) {}

  async perform({
    session,
    sessionData,
    tokenAccount
  }: StartSessionWhatsappHandlerRequest): Promise<{
    session: Client;
    sessionData: ClientSessionDto;
    tokenAccount: string;
  }> {
    const { WABrowserId, WASecretBundle, WAToken1, WAToken2 } = sessionData;

    const sessionOrError = Sessions.create({
      status: "STARTED",
      companyId: tokenAccount,
      wa_browser_id: WABrowserId,
      wa_secret_bundle: WASecretBundle,
      wa_token1: WAToken1,
      wa_token2: WAToken2
    });

    if (sessionOrError.isLeft()) {
      throw new Error(sessionOrError.value.message);
    }

    await this.sessionsRepository.create(sessionOrError.value);

    return;
  }
}
