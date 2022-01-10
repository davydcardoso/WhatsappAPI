import { UseCaseError } from "@core/domain/errors/UseCaseError";

export class SessionAlreadyStartedError extends Error implements UseCaseError {
  constructor() {
    super("The session is already started");
    this.name = "SessionAlreadyStartedError";
  }
}
