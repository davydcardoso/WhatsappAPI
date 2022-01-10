import { Entity } from "@core/domain/Entity";
import { Either, right } from "@core/logic/Either";
import { Document } from "./document";
import { Email } from "./email";
import { InvalidDocumentUserError } from "./errors/InvalidDocumentUserError";
import { InvalidEmailUserError } from "./errors/InvalidEmailUserError";
import { InvalidNameUserError } from "./errors/InvalidNameUserError";
import { InvalidPasswordLengthError } from "./errors/InvalidPasswordLengthError";
import { InvalidPhoneNumberError } from "./errors/InvalidPhoneNumberError";
import { InvalidWebhookAccountError } from "./errors/InvalidWebhookAccountError";
import { Name } from "./name";
import { Password } from "./password";
import { Phone } from "./phone";
import { Webhook } from "./webhook";

interface UsersProps {
  name: Name;
  actived: boolean;
  email: Email;
  password: Password;
  phone: Phone;
  document?: Document;
  webhook?: Webhook;
  webhookToken?: string;
}

export class Users extends Entity<UsersProps> {
  get name() {
    return this.props.name;
  }

  get status() {
    return this.props.actived;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get phone() {
    return this.props.phone;
  }

  get document() {
    return this.props.document;
  }

  get webhook() {
    return this.props.webhook;
  }

  get webhookToken() {
    return this.props.webhookToken;
  }

  private constructor(props: UsersProps, id?: string) {
    super(props, id);
  }

  static create(
    props: UsersProps,
    id?: string
  ): Either<
    | InvalidNameUserError
    | InvalidEmailUserError
    | InvalidPasswordLengthError
    | InvalidPhoneNumberError
    | InvalidDocumentUserError
    | InvalidWebhookAccountError,
    Users
  > {
    const users = new Users(props, id);

    return right(users);
  }
}
