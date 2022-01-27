import { DomainError } from "@core/domain/errors/DomainError";

export class InvalidFantasyNameValueError extends Error implements DomainError {
  constructor(fantasyName: string) {
    super(`Then fantasy name "${fantasyName}" is invalid`);
    this.name = "InvalidFantasyNameValueError";
  }
}
