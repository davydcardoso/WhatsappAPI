import { UseCaseError } from "@core/domain/errors/UseCaseError";

export class UserCannotBeRegisteredError extends Error implements UseCaseError {
  constructor() {
    super(
      "Unable to register your company, there was an error registering user"
    );

    this.name = "UserCannotBeRegisteredError";
  }
}
