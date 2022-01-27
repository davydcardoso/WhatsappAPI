import { DomainError } from "@core/domain/errors/DomainError";

export class InvalidPhoneNumberError extends Error implements DomainError {
  constructor(phone: string) {
    super(`The phone "${phone}" is invalid`);
    this.name = "InvalidPhoneNumberError";
  }
}
