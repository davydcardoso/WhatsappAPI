import { DomainError } from "@core/domain/errors/DomainError";

export class InvalidAccessLevelValueError extends Error implements DomainError {
  constructor(value: string) {
    super(`The access level "${value}" is invalid`);
    this.name = "InvalidAccessLevelValueError";
  }
}
