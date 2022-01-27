import { Users } from "../domain/users";
import { Accounts as PersistenceUser } from "@prisma/client";
import { Name } from "../domain/name";
import { Email } from "../domain/email";
import { Password } from "../domain/password";
import { AccessLevel, accessLevelEnum } from "../domain/accessLevel";

type AccessLevelProps = typeof accessLevelEnum[number];

export class UsersMappers {
  static toDomain(raw: PersistenceUser): Users {
    const nameOrError = Name.create(raw.name);
    const emailOrError = Email.create(raw.email);
    const passwordOrError = Password.create(raw.password, true);
    const accessLevelOrError = AccessLevel.create(raw.access_level);

    if (nameOrError.isLeft()) {
      throw new Error("Name value is invalid.");
    }

    if (emailOrError.isLeft()) {
      throw new Error("Email value is invalid.");
    }

    if (passwordOrError.isLeft()) {
      throw new Error("Password value is invalid.");
    }

    if (accessLevelOrError.isLeft()) {
      throw new Error("Access level value is invalid");
    }
    const userOrError = Users.create(
      {
        name: nameOrError.value,
        email: emailOrError.value,
        password: passwordOrError.value,
        actived: raw.actived,
        companyId: raw.company_id,
        accessLevel: accessLevelOrError.value
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
      access_level: user.accessLevel
        ? user.accessLevel
        : ('"ATTENDANTS"' as AccessLevelProps),
      company_id: user.companyId
    };
  }
}
