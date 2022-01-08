import { Entity } from "@core/domain/Entity";
import { Either, right } from "@core/logic/Either";
import { Document } from "./document";
import { Email } from "./email";
import { InvalidDocumentUserError } from "./errors/InvalidDocumentUserError";
import { InvalidEmailUserError } from "./errors/InvalidEmailUserError";
import { InvalidNameUserError } from "./errors/InvalidNameUserError";
import { InvalidPasswordLengthError } from "./errors/InvalidPasswordLengthError";
import { InvalidPhoneNumberError } from "./errors/InvalidPhoneNumberError";
import { Name } from "./name";
import { Password } from "./password";
import { Phone } from "./phone";

interface UsersProps {
  name: Name;
  actived: boolean;
  email: Email;
  password: Password;
  phone: Phone;
  document?: Document;
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
    | InvalidDocumentUserError,
    Users
  > {
    const users = new Users(props, id);

    return right(users);
  }
}
