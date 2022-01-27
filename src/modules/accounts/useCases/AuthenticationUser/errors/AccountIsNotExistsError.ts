import { UseCaseError } from "@core/domain/errors/UseCaseError";

export class AccountIsNotExistsError extends Error implements UseCaseError {
  constructor() {
    super("User account not found in the system, check access data");
    this.name = "AccountIsNotExistsError";
  }
}
