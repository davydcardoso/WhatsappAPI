import { UseCaseError } from "@core/domain/errors/UseCaseError";

export class AccountIsNotActivedError extends Error implements UseCaseError {
  constructor() {
    super("Your account is not activated yet.");
    this.name = "AccountIsNotActivedError";
  }
}
