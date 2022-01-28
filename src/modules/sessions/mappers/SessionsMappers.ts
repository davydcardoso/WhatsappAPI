import { Sessions as PersistenceSessions } from "@prisma/client";
import { Sessions } from "../domain/sessions";

export class SessionsMapper {
  static toDomain(raw: PersistenceSessions): Sessions {
    const sessionsOrError = Sessions.create({
      status: raw.status,
      companyId: raw.companys_id,
      wa_browser_id: raw.wa_browser_id,
      wa_secret_bundle: raw.wa_secret_bundle,
      wa_token1: raw.wa_token1,
      wa_token2: raw.wa_token2
    });

    if (sessionsOrError.isRight()) {
      return sessionsOrError.value;
    }

    return null;
  }

  static toPersistence(raw: Sessions) {
    return {
      account_id: raw.accountId,
      companys_id: raw.accountId,
      status: raw.status,
      wa_browser_id: raw.waBrowserId,
      wa_secret_bundle: raw.waSecretBundle,
      wa_token1: raw.waToken1,
      wa_token2: raw.waToken2
    };
  }
}
