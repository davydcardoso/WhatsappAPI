import { Either, left, right } from "@core/logic/Either";
import { InvalidEmailUserError } from "@modules/accounts/domain/errors/InvalidEmailUserError";
import { JWT } from "@modules/accounts/domain/jwt";
import { UsersRepository } from "@modules/accounts/repositories/UsersRepository";
import { CompanysRepository } from "@modules/companys/repositories/CompanysRepository";
import { AccountIsNotActivedError } from "./errors/AccountIsNotActivedError";
import { AccountIsNotExistsError } from "./errors/AccountIsNotExistsError";
import { InvalidCompanysIsNotActivedError } from "./errors/InvalidCompanysIsNotActivedError";
import { InvalidEmailOrPasswordError } from "./errors/InvalidEmailOrPasswordError";

type TokenResponse = {
  name: string;
  avatar?: string;
  token: string;
};

type AuthenticationUserRequest = {
  username: string;
  password: string;
};

type AuthenticationUserResponse = Either<
  Error | InvalidEmailUserError | AccountIsNotExistsError,
  TokenResponse
>;

export class AuthenticationUser {
  constructor(
    private usersRepository: UsersRepository,
    private companysRepository: CompanysRepository
  ) {}

  async perform({
    username,
    password
  }: AuthenticationUserRequest): Promise<AuthenticationUserResponse> {
    const user = await this.usersRepository.findByEmail(username);

    const { actived } = await this.companysRepository.findById(user.companyId);

    if (!actived) {
      return left(new InvalidCompanysIsNotActivedError  ());
    }

    if (!user) {
      return left(new AccountIsNotExistsError());
    }

    const isPasswordValid = await user.password.comparePassword(password);

    if (isPasswordValid === false) {
      return left(new InvalidEmailOrPasswordError());
    }

    if (!user.status) {
      return left(new AccountIsNotActivedError());
    }

    const { token } = JWT.signUser(user);

    return right({
      name: user.name.value,
      token
    });
  }
}
