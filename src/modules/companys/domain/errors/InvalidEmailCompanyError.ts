import { DomainError } from "@core/domain/errors/DomainError";

export class InvalidEmailCompanyError extends Error implements DomainError {
  constructor(email: string) {
    super(`The email "${email}" is invalid`);
    this.name = "InvalidEmailUserError";
  }
}
