import { Companys as CompanysPersistence } from "@prisma/client";
import { v4 } from "uuid";
import { Companys } from "../domain/companys";
import { Document } from "../domain/document";
import { Email } from "../domain/email";
import { FantasyName } from "../domain/fantasyName";
import { Name } from "../domain/name";
import { Phone } from "../domain/phone";
import { Webhook } from "../domain/webhook";

export class CompanysMappers {
  static toDomain(raw: CompanysPersistence): Companys {
    const nameOrError = Name.create(raw.name);
    const fantasyNameOrError = FantasyName.create(raw.fantasy_name);
    const documentOrError = Document.create(raw.document);
    const emailOrError = Email.create(raw.email);
    const phoneOrError = Phone.create(raw.phone);
    const webhookOrError = Webhook.create(raw.webhook);

    if (nameOrError.isLeft()) {
      throw new Error("The name is invalid");
    }

    if (fantasyNameOrError.isLeft()) {
      throw new Error("The Fantasy Name is invalid");
    }

    if (documentOrError.isLeft()) {
      throw new Error("The document value is invalid");
    }

    if (emailOrError.isLeft()) {
      throw new Error("The email value is invalid");
    }

    if (phoneOrError.isLeft()) {
      throw new Error("The phone value is invalid");
    }

    if (webhookOrError.isLeft()) {
      throw new Error("The webhook value is invalid");
    }

    const companysOrError = Companys.create({
      actived: raw.actived,
      name: nameOrError.value,
      fantasyName: fantasyNameOrError.value,
      document: documentOrError.value,
      email: emailOrError.value,
      phone: phoneOrError.value,
      webhook: webhookOrError.value
    });

    if (companysOrError.isRight()) {
      return companysOrError.value;
    }

    return null;
  }

  static toPersistence(raw: Companys) {
    return {
      id: raw.id,
      name: raw.name.value,
      fantasy_name: raw.fantasyName.value,
      email: raw.email.value,
      phone: raw.phone.value,
      webhook: raw.webhook.value,
      actived: false,
      document: raw.document.value,
      max_sessions: 1,
      token: v4()
    };
  }
}
