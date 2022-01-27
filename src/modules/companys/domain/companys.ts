import { Name } from "./name";
import { Document } from "./document";
import { FantasyName } from "./fantasyName";
import { Email } from "./email";
import { Webhook } from "./webhook";
import { Entity } from "@core/domain/Entity";
import { Either, right } from "@core/logic/Either";
import { InvalidDocumentValueError } from "./errors/InvalidDocumentValueError";
import { InvalidEmailCompanyError } from "./errors/InvalidEmailCompanyError";
import { InvalidFantasyNameValueError } from "./errors/InvalidFantasyNameValueError";
import { InvalidNameValueError } from "./errors/InvalidNameValueError";
import { InvalidWebhookAccountError } from "./errors/InvalidWebhookAccountError";
import { Phone } from "./phone";
import { InvalidPhoneNumberError } from "./errors/InvalidPhoneNumberError";

type CompanysProps = {
  id?: string;
  name: Name;
  fantasyName: FantasyName;
  document: Document;
  email: Email;
  phone: Phone;
  webhook: Webhook;
};

export class Companys extends Entity<CompanysProps> {
  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get fantasyName() {
    return this.props.fantasyName;
  }

  get document() {
    return this.props.document;
  }

  get email() {
    return this.props.email;
  }

  get phone() {
    return this.props.phone;
  }

  get webhook() {
    return this.props.webhook;
  }

  private constructor(props: CompanysProps, id?: string) {
    super(props, id);
  }

  static create(
    props: CompanysProps,
    id?: string
  ): Either<
    | InvalidDocumentValueError
    | InvalidEmailCompanyError
    | InvalidFantasyNameValueError
    | InvalidNameValueError
    | InvalidPhoneNumberError
    | InvalidWebhookAccountError,
    Companys
  > {
    const companys = new Companys(props, id);

    return right(companys);
  }
}
