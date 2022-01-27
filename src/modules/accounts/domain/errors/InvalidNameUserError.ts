import { DomainError } from "@core/domain/errors/DomainError";

export class InvalidNameUserError extends Error implements DomainError {
  constructor(name: string) {
    super(`The name "${name}" is invalid`);
    this.name = "InvalidNameUserError";
  }
}
