import { DomainError } from "@core/domain/errors/DomainError";

export class InvalidWaBrowserIdError extends Error implements DomainError {
  constructor() {
    super("The WaBrowserIdError value is invalid");
    this.name = "InvalidWaBrowserIdError";
  }
}
