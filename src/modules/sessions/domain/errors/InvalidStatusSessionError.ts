import { DomainError } from "@core/domain/errors/DomainError";

export class InvalidStatusSessionError extends Error implements DomainError {
  constructor() {
    super("The status value is invalid");
    this.name = "InvalidStatusSessionError";
  }
}
