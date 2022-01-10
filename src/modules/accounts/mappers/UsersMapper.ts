import { Users } from "../domain/users";
import { Accounts as PersistenceUser } from "@prisma/client";
import { Name } from "../domain/name";
import { Email } from "../domain/email";
import { Password } from "../domain/password";
import { Phone } from "../domain/phone";
import { Webhook } from "../domain/webhook";

export class UsersMappers {
  static toDomain(raw: PersistenceUser): Users {
    const nameOrError = Name.create(raw.name);
    const emailOrError = Email.create(raw.email);
    const passwordOrError = Password.create(raw.password, true);
    const phoneOrError = Phone.create(raw.phone);
    const webhookOrError = Webhook.create(raw.webhook || "http://localhost");

    if (nameOrError.isLeft()) {
      throw new Error("Name value is invalid.");
    }

    if (emailOrError.isLeft()) {
      throw new Error("Email value is invalid.");
    }

    if (passwordOrError.isLeft()) {
      throw new Error("Password value is invalid.");
    }

    if (phoneOrError.isLeft()) {
      throw new Error("Phone value is invalid");
    }

    if (webhookOrError.isLeft()) {
      throw new Error("Webhook value is invalid");
    }

    const userOrError = Users.create(
      {
        name: nameOrError.value,
        email: emailOrError.value,
        password: passwordOrError.value,
        actived: raw.actived,
        phone: phoneOrError.value,
        webhook: webhookOrError.value,
        webhookToken: raw.webhook_token,
      },
      raw.id
    );

    if (userOrError.isRight()) {
      return userOrError.value;
    }

    return null;
  }

  static async toPersistence(user: Users) {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      actived: user.status,
      password: await user.password.getHashedValue(),
      phone: user.phone.value,
      document: user.document.value,
      webhook: user.webhook.value,
      webhook_token: user.webhookToken,
    };
  }
}
