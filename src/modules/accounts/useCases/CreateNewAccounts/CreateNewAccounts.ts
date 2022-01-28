import { Either, left, right } from "@core/logic/Either";
import { AccessLevel } from "@modules/accounts/domain/accessLevel";
import { Email } from "@modules/accounts/domain/email";
import { InvalidAccessLevelValueError } from "@modules/accounts/domain/errors/InvalidAccessLevelValueError";
import { InvalidEmailUserError } from "@modules/accounts/domain/errors/InvalidEmailUserError";
import { InvalidNameUserError } from "@modules/accounts/domain/errors/InvalidNameUserError";
import { InvalidPasswordLengthError } from "@modules/accounts/domain/errors/InvalidPasswordLengthError";
import { Name } from "@modules/accounts/domain/name";
import { Password } from "@modules/accounts/domain/password";
import { Users } from "@modules/accounts/domain/users";
import { UsersRepository } from "@modules/accounts/repositories/UsersRepository";
import { AccountAlreadyExistsError } from "./errors/AccountAlreadyExistsError";

type CreateNewAccountsRequest = {
  name: string;
  email: string;
  password: string;
  companyId?: string;
  isAdministrator: boolean;
};

type CreateNewAccountsResponse = Either<
  InvalidNameUserError | InvalidEmailUserError | InvalidPasswordLengthError,
  CreateNewAccountsResponseData
>;

type CreateNewAccountsResponseData = {};

export class CreateNewAccounts {
  constructor(private usersRepository: UsersRepository) {}

  async perform({
    name,
    email,
    password,
    companyId,
    isAdministrator
  }: CreateNewAccountsRequest): Promise<CreateNewAccountsResponse> {
    const nameOrError = Name.create(name);
    const emailOrError = Email.create(email);
    const passwordOrError = Password.create(password);

    if (nameOrError.isLeft()) {
      return left(new InvalidNameUserError(name));
    }

    if (emailOrError.isLeft()) {
      return left(new InvalidEmailUserError(email));
    }

    if (passwordOrError.isLeft()) {
      return left(new InvalidPasswordLengthError());
    }

    const userOrError = Users.create({
      name: nameOrError.value,
      email: emailOrError.value,
      password: passwordOrError.value,
      actived: false,
      isAdministrator: isAdministrator,
      companyId: companyId
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user = userOrError.value;

    const userAlreadyExists = await this.usersRepository.exists(
      user.email.value
    );

    if (userAlreadyExists) {
      return left(new AccountAlreadyExistsError(user.email.value));
    }

    await this.usersRepository.create(user);

    return right({});
  }
}
