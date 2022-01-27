import { Name } from "./name";
import { Email } from "./email";
import { Entity } from "@core/domain/Entity";
import { Password } from "./password";
import { AccessLevel } from "./accessLevel";
import { Either, right } from "@core/logic/Either";
import { InvalidNameUserError } from "./errors/InvalidNameUserError";
import { InvalidEmailUserError } from "./errors/InvalidEmailUserError";
import { InvalidPhoneNumberError } from "../../companys/domain/errors/InvalidPhoneNumberError";
import { InvalidPasswordLengthError } from "./errors/InvalidPasswordLengthError";
import { InvalidWebhookAccountError } from "../../companys/domain/errors/InvalidWebhookAccountError";
import { InvalidAccessLevelValueError } from "./errors/InvalidAccessLevelValueError";

interface UsersProps {
  name: Name;
  companyId: string;
  actived: boolean;
  accessLevel?: AccessLevel;
  email: Email;
  password: Password;
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

  get accessLevel() {
    return this.props.accessLevel;
  }

  get companyId() {
    return this.props.companyId;
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
    | InvalidWebhookAccountError
    | InvalidAccessLevelValueError,
    Users
  > {
    const users = new Users(props, id);

    return right(users);
  }
}
