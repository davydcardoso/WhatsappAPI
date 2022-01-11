import { UseCaseError } from "@core/domain/errors/UseCaseError";

export class AccountIsNotExistsError extends Error implements UseCaseError {
  constructor() {
    super("Invalid e-mail, this account does not exist");
    this.name = "AccountIsNotExistsError";
  }
}
