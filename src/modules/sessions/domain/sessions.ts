import { Entity } from "@core/domain/Entity";
import { Either, right } from "@core/logic/Either";

interface SessionsProps {
  status: string;
  accountId: string;
  wa_browser_id: string;
  wa_secret_bundle: string;
  wa_token1: string;
  wa_token2: string;
}

export class Sessions extends Entity<SessionsProps> {
  get status() {
    return this.props.status;
  }

  get accountId() {
    return this.props.accountId;
  }

  get waBrowserId() {
    return this.props.wa_browser_id;
  }

  get waSecretBundle() {
    return this.props.wa_secret_bundle;
  }

  get waToken1() {
    return this.props.wa_token1;
  }

  get waToken2() {
    return this.props.wa_token2;
  }

  private constructor(props: SessionsProps, id?: string) {
    super(props, id);
  }

  static create(props: SessionsProps, id?: string): Either<Error, Sessions> {
    const sessions = new Sessions(props, id);

    return right(sessions);
  }
}
